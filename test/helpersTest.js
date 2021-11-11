const { assert } = require('chai');

const { generateRandomString, lookUpEmail, ownedURLs } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', () => {
  it('should return the userID if the email exists', () => {
    const user = lookUpEmail(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";

    assert.equal(user, expectedUserID);
  });

  it('should return undefined if email doesn\'t exist', () => {
    const user = lookUpEmail(testUsers, "doesnt@exist.com");
    const expectedUserID = undefined;

    assert.equal(user, expectedUserID);
  });

});