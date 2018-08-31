import types from './mutation-types';
import session from '@/api/persist-data';
let songDealDetail = function(state, payLoad, key) {
  let {songs, operator} = payLoad;
  let songData = key === types.HISTORY_SONG_DATA ? state.historySongData : state.songListData;
  operator === 'add' ? (function() {
    if (Array.isArray(songs)) {
      songs.forEach((item) => {
        if (!songData.includes(item)) {
          songData.push(item);
        }
      });
    } else {
      if (!songData.includes(songs)) {
        songData.push(songs);
      }
    }
  }()) : (operator === 'delete' ? (function() {
    let index = songData.indexOf(songs);
    if (index >= 0) {
      songData.splice(index, 1);
    }
  }()) : (operator === 'clear' ? (function() {
    if (key === types.HISTORY_SONG_DATA) {
      state.historySongData = [];
    } else {
      state.songListData = [];
    }
    songData = [];
  }()) : ''));
  if (songData.length || (!songData.length && operator !== 'add')) {
    session.setItem(key, JSON.stringify(songData));
  }
};

export default {
  [types.CURRENT_SKIN]: (state, color) => {
    state.currentSkin = color;
    session.setItem(types.CURRENT_SKIN, color);
  },
  [types.SHOW_MINIAUDIO]: (state, isShow) => {
    state.isShowMiNiAudio = isShow;
  },
  [types.SHOW_SONGLIST]: (state, isShow) => {
    state.isShowSongList = isShow;
  },
  [types.SHOW_GRAPH]: (state, isShow) => {
    state.isShowGraph = isShow;
    session.setItem(types.SHOW_GRAPH, isShow);
  },
  [types.IS_PLAYING]: (state, isPlay) => {
    state.isPlaying = isPlay;
  },
  [types.IS_ENDED]: (state, isEnded) => {
    state.isEnded = isEnded;
  },
  [types.IS_CHANGE_AUDIO]: (state, isChange) => {
    state.isChangeAudio = isChange;
  },
  [types.IS_NEXT_SONG]: (state, isNext) => {
    state.isNextSong = isNext;
  },
  [types.CURRENT_SONG]: (state, song) => {
    state.currentSong = song;
    session.setItem(types.CURRENT_SONG, song);
  },
  [types.SONG_CURRENT_TIME]: (state, currentTime) => {
    state.songCurrentTime = currentTime;
  },
  [types.LOVE_SONGS]: (state, payLoad) => {
    let {id, operator, isAll} = payLoad;
    if (isAll) {
      state.loveSongs = new Set(id);
    } else {
      if (operator === 'add') {
        state.loveSongs.add(id);
      } else if (operator === 'delete') {
        state.loveSongs.delete(id);
      }
    }
    if (state.loveSongs.size || (!state.loveSongs.size && operator === 'delete')) {
      session.setItem(types.LOVE_SONGS, JSON.stringify(state.loveSongs));
    }
  },
  [types.SONG_LIST_DATA]: (state, payLoad) => {
    songDealDetail(state, payLoad, types.SONG_LIST_DATA);
  },
  [types.HISTORY_SONG_DATA]: (state, payLoad) => {
    songDealDetail(state, payLoad, types.HISTORY_SONG_DATA);
  }
};
