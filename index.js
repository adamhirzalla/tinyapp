const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const PORT = 8080;

// CONFIG //
//
// setting ejs as the view engine
// using express's bodyparser to handle request body from buffer
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.listen(PORT, ()=>{
  console.log(`Tinyapp listening on port ${PORT}!`);
});

// DATABASE //
// URLs
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "k2Ue0M": "http://www.google.com"
};

// Users
const users = {
  "012345": {
    id: "012345",
    email: "user1@example.com",
    password: "purple-monkey-dinosaur"
  },
  "678901": {
    id: "678901",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "ABCDEF": {
    id: "ABCDEF",
    email: "user3@example.com",
    password: "qwerty"
  }
};

// HELPER FUNCTIONS //
// generate random 6 char string
const generateRandomString = (randomLength) => {
  let random = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charLength = chars.length;
  for (let i = 0; i < randomLength; i++) {
    random += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return random;
};

// check if an email already exists in users
const lookUpEmail = (users, email) =>{
  for (const userId in users) {
    if (users[userId].email === email) {
      return userId;
    }
  }
  return false;
};

// ROUTING //

// GET //
// GET - root or homepage
app.get('/', (req,res)=>{
  res.send('Hello!');
});

// GET - registration page allowing users to register w email/pass
app.get('/register', (req,res)=>{
  const user = users[req.cookies['user_id']];
  const templateVars = { user };
  res.render('register', templateVars);
});

// GET - login page
app.get('/login', (req,res)=>{
  const user = users[req.cookies['user_id']];
  const templateVars = { user };
  res.render('login', templateVars);
});

// GET - url page showing all urls
app.get('/urls', (req,res)=>{
  const user = users[req.cookies['user_id']];
  const templateVars = { urls: urlDatabase, user };
  res.render('urls_index', templateVars);
});

// GET - shows the urls json object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET - page to creating new urls
app.get("/urls/new", (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

// GET - specific url endpoints using shortended form
app.get('/urls/:shortURL', (req,res)=>{
  const shortURL = req.params.shortURL;
  const user = users[req.cookies['user_id']];
  const templateVars = { urls: urlDatabase, shortURL, user };
  res.render('urls_show', templateVars);
});

// GET - redirect from /u/:shortURL to longURL
app.get('/u/:shortURL', (req,res)=>{
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// POST //
// POST - handling posts form /urls
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls`);
});

// POST - handling delete form /urls/:shortURL/delete
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

// POST - handling edit to /urls/:shortURL/edit
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls');
});

// POST - handling logins
app.post("/login", (req, res) => {
  const { email, password} = req.body;
  const id = lookUpEmail(users, email);
  if (!id) {
    return res.status(403).send('Error 403: account doesnt exist');
  }
  if (users[id].password !== password) {
    return res.status(403).send('Error 403: password doesnt match');
  }
  res.cookie('user_id', id);
  res.redirect('/urls');
});

// POST - handling logouts
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
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
  const id = generateRandomString(6);
  users[id] = {id,email,password};
  res.cookie('user_id', id);
  res.redirect('/urls');
});

