export const formatLyric = function (lyric) {
  let timestamps = [];
  let lyrics = [];
  let copyLyric = lyric;
  let timeRegex = /\[\d+:\d+\.\d+\]/g;
  let lyricRegex = /[^(\[\d+\:\d+\.\d+\])]/g;
  let regex = /\[/g;
  let stringRegex = /\]\:/g;

  copyLyric = copyLyric.replace(timeRegex, '_').split('_');
  lyric = lyric.replace(lyricRegex, '').replace(stringRegex, ']').replace(regex, '').split(']');
  copyLyric.forEach((item) => {
    if (item) {
      lyrics.push(item.trim());
    }
  });
  lyric.forEach((item) => {
    if (item) {
      timestamps.push(item.trim());
    }
  });
  return [timestamps, lyrics];
};

export const pad = function(val) {
  return (val || val === 0) && String(val).length === 1 ? '0' + val : val;
};

export const formatSecToMinu = function(secs) {
  let minutes = Math.floor(secs / 60);
  let seconds = Math.floor(secs % 60);
  return pad(minutes) + ':' + pad(seconds);
};
