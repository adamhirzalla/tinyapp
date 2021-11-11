// DATABASE //
//
// URLs
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: '012345'
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: '012345'
  },
  "k2Ue0M": {
    longURL: "http://www.google.ca",
    userID: 'ABCDEF'
  },
  "ttv": {
    longURL: "http://www.twitch.tv",
    userID: 'Adam'
  },
};

// Users
const users = {
  "012345": {
    id: "012345",
    email: "user1@example.com",
    password: "$2a$10$oxHE1s2UbX.yCl2lc3w3vO18ql9r47igcjy2LhOdUHl.1Lz/ZgiL2" // = 123
  },
  "ABCDEF": {
    id: "ABCDEF",
    email: "user2@example.com",
    password: "$2a$10$LQCHtopu3/CDfipUoyhiMeivX6UHoBDzONd68F.d.l2sB1lE1/spW" // = 123
  },
  "Adam": {
    id: "Adam",
    email: "Adam@hirzalla.ca",
    password: "$2a$10$LYaJq7uKEiGZcpgXWHIMKu0azGMHjwyU29fOFjNdedpOxCojp5jb2" // = empty pass
  }
};

module.exports = {
  urlDatabase,
  users,
};