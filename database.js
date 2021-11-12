// DATABASE //
//
// URLs
const urlDatabase = {
  "ttv": {
    longURL: "http://www.twitch.tv",
    userID: 'Adam',
    visits: 1337,
    timestamps: [],
    uniqueVisits: 0,
    uniqueVisitors: {}, // TODO: uuid cookies for unique visitors
  },
  "rs": {
    longURL: "https://oldschool.runescape.com",
    userID: 'Adam',
    visits: 420,
    timestamps: [],
    uniqueVisits: 0,
    uniqueVisitors: {},
  },
  "yt": {
    longURL: "http://www.youtube.com",
    userID: 'Adam',
    visits: 0,
    timestamps: [],
    uniqueVisits: 0,
    uniqueVisitors: {},
  },
  "LHL": {
    longURL: "http://www.lighthouselabs.ca",
    userID: 'dummy1',
    visits: 0,
    timestamps: [],
    uniqueVisits: 0,
    uniqueVisitors: {},
  },
  "google": {
    longURL: "http://www.google.ca",
    userID: 'dummy2',
    visits: 0,
    timestamps: [],
    uniqueVisits: 0,
    uniqueVisitors: {},
  }
};

// Users
const users = {
  "Adam": {
    id: "Adam",
    email: "Adam@hirzalla.ca",
    password: "$2a$10$LYaJq7uKEiGZcpgXWHIMKu0azGMHjwyU29fOFjNdedpOxCojp5jb2" // = empty pass
  },
  "dummy1": {
    id: "dummy1",
    email: "user1@dummy.com",
    password: "$2a$10$oxHE1s2UbX.yCl2lc3w3vO18ql9r47igcjy2LhOdUHl.1Lz/ZgiL2" // = 123
  },
  "dummy2": {
    id: "dummy2",
    email: "user2@dummy.com",
    password: "$2a$10$LQCHtopu3/CDfipUoyhiMeivX6UHoBDzONd68F.d.l2sB1lE1/spW" // = 123
  }
};

module.exports = {
  urlDatabase,
  users,
};