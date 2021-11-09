const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;

// setting ejs as the view engine
app.set('view engine', 'ejs');

// using bodyparser to handle request body from buffer
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.listen(PORT, ()=>{
  console.log(`Example app listening on port ${PORT}!`);
});

// root or homepage
app.get('/', (req,res)=>{
  res.send('Hello!');
});

// shows the urls json object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// url page showing all urls
app.get('/urls', (req,res)=>{
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// POSTing new url
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// specific url endpoints using shortended form
app.get('/urls/:shortURL', (req,res)=>{
  const shortURL = req.params.shortURL;
  const templateVars = { urls: urlDatabase, shortURL, longURL: urlDatabase[shortURL]};
  res.render('urls_show', templateVars);
});

const generateRandomString = () => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// handling form POST
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

