import types from './mutation-types';

export default {
  changeSkin: ({commit}, color) => {
    if (color) {
      commit(types.CURRENT_SKIN, color);
    }
  },
  showMiNiAudio: ({commit}, isShow) => {
    commit(types.SHOW_MINIAUDIO, isShow);
  },
  showSongList: ({commit}, isShow) => {
    commit(types.SHOW_SONGLIST, isShow);
  },
  commitLoveSongList: ({commit}, payLoad) => {
    commit(types.LOVE_SONGS, payLoad);
  },
  commitSongListData: ({commit}, payLoad) => {
    commit(types.SONG_LIST_DATA, payLoad);
  },
  commitCurrentSong: ({commit}, song) => {
    commit(types.CURRENT_SONG, song);
  },
  commitIsShowGraph: ({commit}, isShow) => {
    commit(types.SHOW_GRAPH, isShow);
  },
  commitIsPlaying: ({commit}, isPlay) => {
    commit(types.IS_PLAYING, isPlay);
  },
  commitSongCurrentTime: ({commit}, currentTime) => {
    commit(types.SONG_CURRENT_TIME, currentTime);
  },
  commitHistorySongData: ({commit}, payLoad) => {
    commit(types.HISTORY_SONG_DATA, payLoad);
  },
  commitIsChangeAudio: ({commit}, isChange) => {
    commit(types.IS_CHANGE_AUDIO, isChange);
  },
  commitIsEnded: ({commit}, isEnded) => {
    commit(types.IS_ENDED, isEnded);
  },
  commitIsNextSong: ({commit}, isNext) => {
    commit(types.IS_NEXT_SONG, isNext);
  }
};
