import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);
let state = {
  currentSkin: 'black',
  isShowMiNiAudio: false,
  isShowSongList: false,
  isShowGraph: false,
  isPlaying: false,
  isChangeAudio: false,
  isEnded: false,
  isNextSong: false,
  loveSongs: new Set(),
  songListData: [],
  historySongData: [],
  currentSong: null,
  songCurrentTime: 0
};

const store = new Vuex.Store({
  state,
  actions,
  getters,
  mutations
});

export default store;
