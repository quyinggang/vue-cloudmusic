let tools = {};

tools.pad = function(val) {
  return (val || val === 0) && String(val).length === 1 ? '0' + val : val;
};

tools.formatSecToMinu = function(secs) {
  let minutes = Math.floor(secs / 60);
  let seconds = Math.floor(secs % 60);
  return tools.pad(minutes) + ':' + tools.pad(seconds);
};

export default {
  formatSecToMinu: tools.formatSecToMinu,
  pad: tools.pad
};
