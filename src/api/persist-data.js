const session = {};
const sessionStorage = window.sessionStorage;

session.setItem = function(key, val) {
  sessionStorage.setItem(key, val);
};

session.getItem = function(key) {
  return sessionStorage.getItem(key);
};

session.removeItem = function(key) {
  sessionStorage.removeItem(key);
};

export default session;
