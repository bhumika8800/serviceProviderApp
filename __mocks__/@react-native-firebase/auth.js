const auth = () => ({
  signInWithPhoneNumber: jest.fn(),
  signInWithCredential: jest.fn(),
  signOut: jest.fn(),
  currentUser: null,
});

auth.GoogleAuthProvider = {
  credential: jest.fn(),
};

module.exports = auth;
module.exports.__esModule = true;
module.exports.default = auth;
