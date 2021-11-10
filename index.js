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

// DATABSE - local db
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// generate random 6 char string
const generateRandomString = () => {
  let random = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charLength = chars.length;
  const randomLength = 6;
  for (let i = 0; i < randomLength; i++) {
    random += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return random;
};

// ROUTING //

// GET //
// GET - root or homepage
app.get('/', (req,res)=>{
  res.send('Hello!');
});

// GET - url page showing all urls
app.get('/urls', (req,res)=>{
  const templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render('urls_index', templateVars);
});

// GET - shows the urls json object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET - page to creating new urls
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies.username };
  res.render("urls_new", templateVars);
});

// GET - specific url endpoints using shortended form
app.get('/urls/:shortURL', (req,res)=>{
  const shortURL = req.params.shortURL;
  const templateVars = { urls: urlDatabase, shortURL, username: req.cookies.username };
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
  const shortURL = generateRandomString();
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
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
});

// POST - handling logouts
app.post("/logout", (req, res) => {
  res.cookie('username', '');
  res.redirect('/urls');
});