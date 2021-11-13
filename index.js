// IMPORTS //
//
const express = require('express');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');
const { urlDatabase, users } = require('./database');
const { generateRandomString, lookUpEmail, ownedURLs, addVisit, addUniqueVisit, isUnique } = require('./helpers');

// CONFIG //
//
// setting ejs as the view engine
// using express's bodyparser to handle request body from buffer
// using cookie-session with options -> secret key sets + expiry timer
// using methodOverride to override with POST having ?_method=DELETE
// express listning on port 8080
const app = express();
const PORT = 8080;
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(cookieSession({
  name: 'session',
  keys: ['imagine trying', 'to steal', 'my COOKIES', 'OMEGALUL'],
  maxAge: 12 * 60 * 60 * 1000, // expires after 12 hrs
}));
app.use(methodOverride('_method'));
app.listen(PORT, ()=>{
  console.log(`Tinyapp listening on port ${PORT}!`);
});

// ROUTING //
//
// GET //
// GET - / -> root or homepage
app.get('/', (req,res)=>{
  const user = users[req.session['user_id']];
  if (!user) {
    return res.redirect('/login');
  }
  res.redirect('/urls');
});

// GET - /register -> registration page allowing users to register w email/pass
app.get('/register', (req,res)=>{
  const user = users[req.session['user_id']];
  if (user) {
    return res.redirect('/urls');
  }
  const templateVars = { user };
  res.render('register', templateVars);
});

// GET - /login -> login page
app.get('/login', (req,res)=>{
  const user = users[req.session['user_id']];
  if (user) {
    return res.redirect('/urls');
  }
  const templateVars = { user };
  res.render('login', templateVars);
});

// GET - /urls -> url page showing all urls
app.get('/urls', (req,res)=>{
  const user = users[req.session['user_id']];
  const urls = ownedURLs(urlDatabase, user);
  const templateVars = { urls, user };
  res.render('urls_index', templateVars);
});

// GET - /urls/new -> page to creating new urls
app.get("/urls/new", (req, res) => {
  const user = users[req.session['user_id']];
  if (!user) {
    return res.status(401).redirect('/login');
  }
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

// GET - /urls/:id -> view specific url endpoints using shortended form
app.get('/urls/:shortURL', (req,res)=>{
  const shortURL = req.params.shortURL;
  const user = users[req.session['user_id']];
  if (!user) {
    const error = '<strong class="text-danger">Error 401:</strong> Unauthorized! <a href="/login">Login</a> first.';
    return res.status(401).render('error', {user, error});
  }
  if (!urlDatabase[shortURL]) {
    const error = '<strong class="text-danger">Error 404:</strong> Link does not exist!';
    return res.status(404).render('error', {user, error});
  }
  if (urlDatabase[shortURL].userID !== user.id) {
    const error = '<strong class="text-danger">Error 401:</strong> Unauthorized! URL does not belong to you.';
    return res.status(401).render('error', {user, error});
  }
  const templateVars = { urls: urlDatabase, shortURL, user };
  res.render('urls_show', templateVars);
});

// GET - /u/:id -> redirect from /u/:shortURL to longURL
app.get('/u/:shortURL', (req, res)=>{
  const shortURL = req.params.shortURL;
  const user = users[req.session['user_id']];
  if (!urlDatabase[shortURL]) {
    const error = '<strong class="text-danger">Error 404:</strong> Link does not exist!';
    return res.status(404).render('error', {user, error});
  }
  
  // ANALYTICS //
  addVisit(urlDatabase, shortURL);
  let visitorID = req.session['visitor_id'];
  if (!visitorID) {
    // if no visitor_id cookie found, set one and increment unique
    // visits while adding ID to shortURL db
    visitorID = generateRandomString(5);
    req.session['visitor_id'] = visitorID;
    addUniqueVisit(urlDatabase, shortURL, visitorID);
  } else if (isUnique(urlDatabase, shortURL, visitorID)) {
    // already has a visitor_id cookie, but is a unique visitor
    // increment unique visits and add ID to db
    addUniqueVisit(urlDatabase, shortURL, visitorID);
  }

  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// POST //
// POST - /urls -> handling creating new urls
app.post("/urls", (req, res) => {
  const user = users[req.session['user_id']];
  let longURL = req.body.longURL;
  if (!longURL.includes('https://') && !longURL.includes('http://')) {
    longURL = `https://www.${longURL}`;
  }
  if (!user) {
    return res.status(401).send('Error 401: Unauthorized! Cant create URL: Login/Register first.\n');
  }
  const shortURL = generateRandomString(6);
  // populate/initialize keys for new url
  const creationDate = new Date().toDateString();
  urlDatabase[shortURL] = { longURL, userID: user.id, creationDate, visits: 0, timestamps: [], uniqueVisits: 0, uniqueVisitors: {} };
  res.redirect(`/urls`);
});

// POST - /login -> handling logins
app.post("/login", (req, res) => {
  const { email, password} = req.body;
  const user = users[req.session['user_id']];
  const id = lookUpEmail(users, email);
  if (!id) {
    const error = '<strong class="text-danger">Error 403:</strong> Account does not exist! <a href="/login">Try again</a> or <a href="/register">Register</a>';
    return res.status(403).render('error', {user, error});
  }
  bcrypt.compare(password, users[id].password).then(match => {
    if (!match) {
      const error = '<strong class="text-danger">Error 403:</strong> Password does not match! <a href="/login">Try again</a> or <a href="/register">Register</a>';
      return res.status(403).render('error', {user, error});
    }
    req.session['user_id'] = id;
    res.redirect('/urls');
  });
});

// POST - /logout -> handling logouts
app.post("/logout", (req, res) => {
  // destroy entire session cookie
  req.session = null;
  res.redirect('/urls');
});

// POST - /register -> handling registrations
app.post("/register", (req, res) => {
  const {email, password} = req.body;
  const user = users[req.session['user_id']];
  if (!email || !password) {
    const error = '<strong class="text-danger">Error 400:</strong> Can\'t Register: Email/Password cannot be empty! <a href="/register">Try again</a> or <a href="/login">Login</a>';
    return res.status(400).render('error', {user, error});
  }
  if (lookUpEmail(users, email)) {
    const error = '<strong class="text-danger">Error 400:</strong> Can\'t Register: Email already exists! <a href="/register">Try again</a> or <a href="/login">Login</a>';
    return res.status(400).render('error', {user, error});
  }
  bcrypt.hash(password, 10).then(hashed => {
    const id = generateRandomString(6);
    users[id] = {id, email, password: hashed};
    req.session['user_id'] = id;
    res.redirect('/urls');
  });
});

// PUT //
//
// PUT - /urls/:id ->  handling edit to /urls/:shortURL?_method=PUT
app.put("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const user = users[req.session['user_id']];
  let longURL = req.body.longURL;
  if (!user) {
    return res.status(401).send('Error 401: Unauthorized! Cant edit: Login/Register first.\n');
  }
  if (!urlDatabase[shortURL]) {
    return res.status(404).send('Error 404: Cant edit: Link does not exist!\n');
  }
  if (urlDatabase[shortURL].userID !== user.id) {
    return res.status(401).send('Error 401: Unauthorized. Cant edit: URL does not belong to you.\n');
  }
  if (!longURL.includes('https://') && !longURL.includes('http://')) {
    longURL = `https://www.${longURL}`;
  }
  urlDatabase[shortURL] = { longURL };
  urlDatabase[shortURL].userID = user.id;
  // reset all old stats for the updated link
  urlDatabase[shortURL].visits = 0;
  urlDatabase[shortURL].timestamps = [];
  urlDatabase[shortURL].uniqueVisits = 0;
  urlDatabase[shortURL].uniqueVisitors = {};
  res.redirect('/urls');
});

// DELETE //
//
// DELETE - urls/:id -> handling delete form /urls/:shortURL?_method=DELETE
app.delete("/urls/:shortURL", (req, res) => {
  const user = users[req.session['user_id']];
  const shortURL = req.params.shortURL;
  if (!user) {
    return res.status(401).send('Error 401: Unauthorized! Cant delete: Login/Register first.\n');
  }
  if (!urlDatabase[shortURL]) {
    return res.status(404).send('Error 404: Cant delete: Link does not exist!\n');
  }
  if (urlDatabase[shortURL].userID !== user.id) {
    return res.status(401).send('Error 401: Unauthorized. Cant delete: URL does not belong to you.\n');
  }
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});