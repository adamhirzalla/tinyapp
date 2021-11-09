const express = require('express');
const app = express();
const PORT = 8080;

// CONFIG //
//
// setting ejs as the view engine
// using express's bodyparser to handle request body from buffer
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

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
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// GET - shows the urls json object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET - page to creating new urls
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// GET - specific url endpoints using shortended form
app.get('/urls/:shortURL', (req,res)=>{
  const shortURL = req.params.shortURL;
  const templateVars = { urls: urlDatabase, shortURL, longURL: urlDatabase[shortURL]};
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
  console.log(req.body);  // Log the POST request body to the console
  urlDatabase[shortURL] = req.body.longURL;
  res.statusCode = 200;
  res.redirect(`/urls/${shortURL}`);
});

// POST - handling posts form /urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log(shortURL);
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});