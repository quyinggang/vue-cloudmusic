let session = {};

session.setItem = function(key, val) {
  window.sessionStorage.setItem(key, val);
};

session.getItem = function(key) {
  return window.sessionStorage.getItem(key);
};

session.removeItem = function(key) {
  window.sessionStorage.removeItem(key);
};

export default session;
