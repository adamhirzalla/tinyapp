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

// check if an email already exists in users, if yes, return the user
const lookUpEmail = (users, email) =>{
  for (const id in users) {
    if (users[id].email.toLowerCase() === email.toLowerCase()) {
      return id;
    }
  }
  return false;
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

module.exports = {
  generateRandomString,
  lookUpEmail,
  ownedURLs
};