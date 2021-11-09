const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

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

// url page showing all urls
app.get('/urls', (req,res)=>{
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// specific url endpoints using shortended form
app.get('/urls/:shortURL', (req,res)=>{
  const shortURL = req.params.shortURL;
  const templateVars = { urls: urlDatabase, shortURL, longURL: urlDatabase[shortURL]};
  res.render('urls_show', templateVars);
});

// shows the urls json object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});