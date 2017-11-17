let formatLyric = function (lyric) {
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

export default {
  formatLyric
};
