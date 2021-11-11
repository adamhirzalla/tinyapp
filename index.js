// IMPORTS //
//
const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { urlDatabase, users } = require('./database');
const { generateRandomString, lookUpEmail, ownedURLs } = require('./helpers');

// CONFIG //
//
// setting ejs as the view engine
// using express's bodyparser to handle request body from buffer
const app = express();
const PORT = 8080;
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(cookieSession({
  name: 'session',
  keys: ['imagine trying', 'to steal', 'my COOKIES', 'OMEGALUL'],
  maxAge: 12 * 60 * 60 * 1000, // expires after 12 hrs
}));
app.listen(PORT, ()=>{
  console.log(`Tinyapp listening on port ${PORT}!`);
});

// ROUTING //
//
// GET //
// GET - root or homepage
app.get('/', (req,res)=>{
  res.send('Hello!');
});

// GET - registration page allowing users to register w email/pass
app.get('/register', (req,res)=>{
  const user = users[req.session['user_id']];
  const templateVars = { user };
  res.render('register', templateVars);
});

// GET - login page
app.get('/login', (req,res)=>{
  const user = users[req.session['user_id']];
  const templateVars = { user };
  res.render('login', templateVars);
});

// GET - url page showing all urls
app.get('/urls', (req,res)=>{
  const user = users[req.session['user_id']];
  const urls = ownedURLs(urlDatabase, user);
  const templateVars = { urls, user };
  res.render('urls_index', templateVars);
});

// GET - shows the urls json object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET - page to creating new urls
app.get("/urls/new", (req, res) => {
  const user = users[req.session['user_id']];
  if (!user) {
    return res.status(401).redirect('/urls');
  }
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

// GET - view specific url endpoints using shortended form
app.get('/urls/:shortURL', (req,res)=>{
  const shortURL = req.params.shortURL;
  const user = users[req.session['user_id']];
  if (!user) {
    return res.status(401).send('Error 401: unauthorized. Login/register first');
  }
  if (!urlDatabase[shortURL]) {
    return res.status(404).send('Error 404: link does not exist');
  }
  if (urlDatabase[shortURL].userID !== user.id) {
    return res.status(401).send('Error 401: unauthorized. url does not belong to you');
  }
  const templateVars = { urls: urlDatabase, shortURL, user };
  res.render('urls_show', templateVars);
});

// GET - redirect from /u/:shortURL to longURL
app.get('/u/:shortURL', (req,res)=>{
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.status(404).send('Error 404: link does not exist');
  }
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// POST //
// POST - handling creating new urls
app.post("/urls", (req, res) => {
  const user = users[req.session['user_id']];
  const longURL = `https://www.${req.body.longURL}`;
  if (!user) {
    return res.status(401).send('Error 401: unauthorized. Cant create url: Login/register first');
  }
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = { longURL, userID: user.id };
  res.redirect(`/urls`);
});

// POST - handling delete form /urls/:shortURL/delete
app.post("/urls/:shortURL/delete", (req, res) => {
  const user = users[req.session['user_id']];
  const shortURL = req.params.shortURL;
  if (!user) {
    return res.status(401).send('Error 401: unauthorized. Cant delete: Login/register first');
  }
  if (!urlDatabase[shortURL]) {
    return res.status(404).send('Error 404: link does not exist');
  }
  if (urlDatabase[shortURL].userID !== user.id) {
    return res.status(401).send('Error 401: unauthorized. Cant delete: url does not belong to you');
  }
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

// POST - handling edit to /urls/:shortURL/edit
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const user = users[req.session['user_id']];
  const longURL = req.body.longURL;
  if (!user) {
    return res.status(401).send('Error 401: unauthorized. Cant edit: Login/register first');
  }
  if (!urlDatabase[shortURL]) {
    return res.status(404).send('Error 404: link does not exist');
  }
  if (urlDatabase[shortURL].userID !== user.id) {
    return res.status(401).send('Error 401: unauthorized. Cant edit: url does not belong to you');
  }
  urlDatabase[shortURL].longURL = `https://www.${longURL}`;
  urlDatabase[shortURL].userID = user.id;
  res.redirect('/urls');
});

// POST - handling logins
app.post("/login", (req, res) => {
  const { email, password} = req.body;
  const id = lookUpEmail(users, email);
  if (!id) {
    return res.status(403).send('Error 403: account doesnt exist');
  }
  bcrypt.compare(password, users[id].password).then(match => {
    if (!match) {
      return res.status(403).send('Error 403: password doesnt match');
    }
    req.session['user_id'] = id;
    res.redirect('/urls');
  });
});

// POST - handling logouts
app.post("/logout", (req, res) => {
  // destroy entire session cookie
  req.session = null;
  res.redirect('/urls');
});

// POST - handling registrations
app.post("/register", (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).send('Error 400: email/password cant be empty');
  }
  if (lookUpEmail(users, email)) {
    return res.status(400).send('Error 400: email already exists');
  }
  bcrypt.hash(password, 10).then(hashed => {
    const id = generateRandomString(6);
    users[id] = {id, email, password: hashed};
    res.redirect('/urls');
  });
});
