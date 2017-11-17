export default {
  getCurrentSkin: (state) => {
    return state.currentSkin;
  },
  getShowMiNiAudio: (state) => {
    return state.isShowMiNiAudio;
  },
  getShowSongList: (state) => {
    return state.isShowSongList;
  },
  getLoveSongList: (state) => {
    return state.loveSongs;
  },
  getSongListData: (state) => {
    return state.songListData;
  },
  getCurrentSong: (state) => {
    return state.currentSong;
  },
  getIsShowGraph: (state) => {
    return state.isShowGraph;
  },
  getIsPlaying: (state) => {
    return state.isPlaying;
  },
  getSongCurrentTime: (state) => {
    return state.songCurrentTime;
  },
  getHistorySongData: (state) => {
    return state.historySongData;
  },
  getIsChangeAudio: (state) => {
    return state.isChangeAudio;
  },
  getIsEnded: (state) => {
    return state.isEnded;
  },
  getIsNextSong: (state) => {
    return state.isNextSong;
  }
};
