const mockAuthInstance = {
  currentUser: null,
};

const auth = () => mockAuthInstance;

auth.getAuth = () => mockAuthInstance;
auth.getIdToken = jest.fn();
auth.signInWithPhoneNumber = jest.fn();
auth.signInWithCredential = jest.fn();
auth.signOut = jest.fn();
auth.GoogleAuthProvider = {
  credential: jest.fn(),
};

module.exports = auth;
module.exports.__esModule = true;
module.exports.default = auth;
