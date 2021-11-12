/* eslint-disable camelcase */
// HELPER FUNCTIONS //
//
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

// check if an email already exists in users, if yes, return the user id
const lookUpEmail = (users, email) =>{
  for (const id in users) {
    if (users[id].email.toLowerCase() === email.toLowerCase()) {
      return id;
    }
  }
};

// returns urls belonging to specific user
const ownedURLs = (allURLs, user) =>{
  const result = {};
  if (user) {
    const userId = user.id;
    for (const shortURL in allURLs) {
      if (allURLs[shortURL].userID === userId) {
        const { longURL, userID } = allURLs[shortURL];
        result[shortURL] = { longURL, userID };
      }
    }
  }
  return result;
};

const addVisit = (allURLs, URL) => {
  // set id to 1 if first visitor, otherwise add 1 from last visitor
  const visitor_id = allURLs[URL].timestamps.length !== 0 ? allURLs[URL].timestamps[0]['visitor_id'] + 1 : 1;
  const timestamp = new Date().toLocaleString();
  const visit = { timestamp, visitor_id };
  allURLs[URL].timestamps.unshift(visit); // add most recent visit to head of array
  // add a visit or set to 0 if newly created
  return allURLs[URL].visits = (++allURLs[URL].visits || 0);
};

const addUniqueVisit = (allURLs, URL) => {
  // TODO: Implement unique visitors tracker
};

const isUnique = () => {
  // TODO: Implement unique visitors tracker
};

module.exports = {
  generateRandomString,
  lookUpEmail,
  ownedURLs,
  addVisit,
  addUniqueVisit,
  isUnique,
};