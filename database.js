// DATABASE //
//
// URLs
const urlDatabase = {
  "TTV": {
    longURL: "https://www.twitch.tv",
    userID: 'Adam',
    creationDate: 'Thu Nov 11 2021',
    visits: 1337,
    timestamps: [],
    uniqueVisits: 0,
    uniqueVisitors: {},
  },
  "RS": {
    longURL: "https://oldschool.runescape.com",
    userID: 'Adam',
    creationDate: 'Fri Nov 12 2021',
    visits: 420,
    timestamps: [],
    uniqueVisits: 0,
    uniqueVisitors: {},
  },
  "YT": {
    longURL: "https://www.youtube.com",
    userID: 'Adam',
    creationDate: 'Sat Nov 13 2021',
    visits: 0,
    timestamps: [],
    uniqueVisits: 0,
    uniqueVisitors: {},
  },
  "LHL": {
    longURL: "https://www.lighthouselabs.ca",
    userID: 'dummy1',
    creationDate: 'Tue Jan 3 1337',
    visits: 0,
    timestamps: [],
    uniqueVisits: 0,
    uniqueVisitors: {},
  },
  "google": {
    longURL: "https://www.google.ca",
    userID: 'dummy2',
    creationDate: 'Wed Dec 2 1009',
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