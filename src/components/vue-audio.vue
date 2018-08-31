<template>
  <section class="audio">
    <audio
      id="audio"
      style="width: 0;height: 0;"
      preload="auto"
      :src="currentSong ? currentSong.src : ''">
    </audio>
    <ul class="container" :class="[isThemeOfOther ? classes.isOther : classes.isDefault]">
      <li class="item control" @click="handleControlClick">
        <span class="icon prev" v-show="!isHidden" :style="bgStyle">
          <i class="fa fa-step-backward"></i>
        </span>
        <span class="icon state" :style="bgStyle">
          <i :class="[isPlaying ? classes.pause : classes.play]"></i>
        </span>
        <span class="icon next" :style="bgStyle">
          <i class="fa fa-step-forward"></i>
        </span>
      </li>
      <li class="item progress" :style="progressStyle">
        <label>{{getCurrentTime}}</label>
        <div class="run-way" @click="handleClickBar($event, 'song')">
          <div class="buffer"></div>
          <div class="bar" :style="songBarStyle">
            <div class="btn-wrapper"
              @mousedown="hanldeSongButtonDown">
              <div class="btn" :style="btnStyle"></div>
            </div>
          </div>
        </div>
        <label>{{audioData.formatDuration}}</label>
      </li>
      <li class="item volume">
        <span class="icon">
          <i class="fa fa-volume-up"></i>
        </span>
        <div class="run-way" @click="handleClickBar($event, 'volume')">
          <div class="bar" :style="volumeBarStyle">
            <div class="btn-wrapper"
              @mousedown="hanldeVolumeButtonDown">
              <div class="btn" :style="btnStyle"></div>
            </div>
          </div>
        </div>
      </li>
      <li class="item song-about">
        <span
          v-show="!isHidden"
          class="icon play-mode"
          @click="changePlayMode"
          :title="getCurrentModeMsg">
          <i :class="modes[currentModeIndex]"></i>
          <span class="single" v-show="currentModeIndex === 2">1</span>
        </span>
        <span class="icon lyric" @click="openMiNiAudio">词</span>
        <span
          v-show="!isHidden"
          class="icon song-list"
          @click="openSongList">
          <i class="fa fa-list"></i>
          <span class="size">{{songs.length}}</span>
        </span>
      </li>
    </ul>
    <song-list v-show="getShowSongList" :songs="songs"></song-list>
    <song-graph v-show="showGraph" :currentSong="currentSong"></song-graph>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SongList from './song-list';
import SongGraph from './song-graph';
import ApiData from '@/api/data';
import session from '@/api/persist-data';
import * as consts from '@/api/consts';
import { formatSecToMinu } from '@/utils/format';
import MixinTheme from '@/mixins/mixin-theme';
export default {
  components: {
    SongList,
    SongGraph
  },
  mixins: [MixinTheme],
  data() {
    return {
      theme: null,
      fmSongs: [],
      fmIndex: 0,
      songIds: [],
      songs: [],
      isThemeOfOther: false,
      isListEnded: false,
      isHidden: false,
      isPlaying: false,
      isShowGraph: false,
      isVolumeBtn: false,
      currentSong: null,
      currentSongIndex: 0,
      currentModeIndex: 0,
      modes: ['fa fa-bars', 'fa fa-refresh', 'fa fa-refresh', 'fa fa-random'],
      songBar: {
        left: 0,
        width: 0,
        max: 100,
        currentValue: 0,
        dragging: false,
        range: null,
        initClientX: 0
      },
      volumeBar: {
        left: 0,
        width: 0,
        max: 100,
        currentValue: 0,
        dragging: false,
        range: null,
        initClientX: 0
      },
      audioData: {
        theAudio: null,
        currentTime: 0,
        duration: 0,
        formatDuration: '00:00',
        buffered: 0,
        played: 0,
        ended: false,
        currentVolume: 0
      },
      classes: {
        play: 'fa fa-play',
        pause: 'fa fa-pause',
        isDefault: 'is-default-theme',
        isOther: 'is-other-theme'
      }
    };
  },
  computed: {
    ...mapGetters([
      'getShowMiNiAudio',
      'getShowSongList',
      'getSongListData',
      'getCurrentSong',
      'getIsShowGraph',
      'getIsPlaying',
      'getIsChangeAudio',
      'getLoveSongList'
    ]),
    progressStyle() {
      let color = this.theme.audio === 'transparent' ? '#D5D6DC' : (function(that) {
        that.isThemeOfOther = true;
        return '#4E4E4E';
      })(this);
      return {color: color};
    },
    btnStyle() {
      let audio = this.theme.audio;
      let progressColor = audio === 'transparent' ? '#B82525' : audio;
      return {background: progressColor};
    },
    bgStyle() {
      let audio = this.theme.audio;
      let border = this.isThemeOfOther ? 'rgba(0, 0, 0, .1)' : '#565659';
      return {background: audio, border: `1px solid ${border}`};
    },
    showGraph() {
      let isShow = this.isShowGraph;
      if ((this.getCurrentRoutePath === '/selfFM' && this.isHidden) || !this.currentSong) {
        isShow = false;
      }
      return isShow;
    },
    songBarStyle() {
      let bg = this.btnStyle;
      return {width: `${this.songBar.currentValue}%`, ...bg};
    },
    volumeBarStyle() {
      let bg = this.btnStyle;
      return {width: `${this.volumeBar.currentValue}%`, ...bg};
    },
    songBarLeft() {
      return [this.songBar.left, 'song'];
    },
    volumeBarLeft() {
      return [this.volumeBar.left, 'volume'];
    },
    getCurrentModeMsg() {
      let mode = this.currentModeIndex;
      return mode === 0 ? '顺序播放' : (mode === 1 ? '循环播放' : (
        mode === 2 ? '单曲循环播放' : '随机播放'));
    },
    getSongListDataLength() {
      return this.getSongListData.length;
    },
    getCurrentTime() {
      let {currentTime, duration} = this.audioData;
      if (!this.songBar.dragging) {
        let precision = currentTime / duration;
        let songBar = this.songBar;
        let {width, range, max} = songBar;
        if (range) {
          this.$set(songBar, 'left', Math.min(precision * max * 0.01 * width, range[1]));
        }
      }
      return formatSecToMinu(this.audioData.currentTime);
    },
    getCurrentVolume() {
      return this.audioData.currentVolume;
    },
    getCurrentRoutePath() {
      return this.$route.path;
    }
  },
  watch: {
    songBarLeft: 'handleBarLeft',
    volumeBarLeft: 'handleBarLeft',
    theme: {
      handler(skinObj) {
        this.isThemeOfOther = skinObj.audio !== 'transparent' ? true : Boolean(false);
      },
      deep: true
    },
    getSongListDataLength(len) {
      if (!len) {
        this.songs = [];
        this.songIds = [];
        this.commitCurrentSong();
        this.commitIsShowGraph(false);
        return;
      }
      let uniqueKeys = new Set(this.songIds);
      let songs = this.getSongListData;
      songs.forEach((item) => {
        if (item && !uniqueKeys.has(item)) {
          uniqueKeys.add(item);
          let {target} = this.getTargetSong(item);
          this.$set(target, 'state', -1);
          this.songs.push(target);
        }
      });
      this.songIds = [...uniqueKeys];
      this.isShowGraph = this.songs.length ? Boolean(true) : false;
      this.commitIsShowGraph(this.isShowGraph);
      if (this.songs && this.currentSong) {
        this.play();
      }
    },
    // 私有fm时，audio的改变
    getIsChangeAudio(isChange) {
      this.isHidden = isChange;
    },
    // 监听当前歌曲的变化
    getCurrentSong(sId) {
      if (!sId || Number.isNaN(window.parseInt(sId))) {
        this.currentSong = null;
        this.audioData.currentTime = 0;
        this.audioData.duration = 0;
        this.audioData.formatDuration = '00:00';
        this.commitIsPlaying(false);
        return;
      }
      this.commitIsEnded(false);
      this.commitHistorySongData({songs: `${sId}+${+new Date()}`, operator: 'add'});
      if (this.isHidden) {
        let {target, index} = this.getTargetSong(sId);
        this.currentSongIndex = index;
        this.currentSong = target;
        this.play();
        return;
      }
      for (let index = 0, len = this.songs.length; index < len; index++) {
        let item = this.songs[index];
        this.$set(item, 'state', -1);
        if (item.id === sId) {
          this.currentSong = item;
          this.currentSongIndex = index;
          this.$set(item, 'state', 1);
          // 触发监听
          this.songs.splice(index, 1, item);
          this.play();
        }
      }
    },
    // 监听播放状态的变化
    isPlaying(val) {
      this.commitIsPlaying(val);
    },
    getIsPlaying(isPlaying) {
      isPlaying ? this.play() : this.pause();
    },
    // 音量
    getCurrentVolume(val) {
      let percision = val * 100;
      let {range} = this.volumeBar;
      if (range) {
        this.$set(this.volumeBar, 'left', Math.min(percision, range[1]));
      }
    },
    // songGraph显示
    getIsShowGraph(val) {
      this.isShowGraph = typeof val === 'string' ? (val === 'false' ? false : Boolean(true)) : val;
    }
  },
  created() {
    // 刷新之后的处理，歌单、当前歌曲
    if (!this.getSongListData.length) {
      this.commitSongListData({songs: JSON.parse(session.getItem(consts.SONG_LIST_DATA)), operator: 'add'});
      this.commitCurrentSong(session.getItem(consts.CURRENT_SONG));
      if (!Number.isNaN(window.parseInt(this.getCurrentSong))) {
        let {target, index} = this.getTargetSong(this.getCurrentSong);
        this.currentSongIndex = index;
        this.currentSong = target;
        // this.play();
      }
      let songIds = [...this.getLoveSongList];
      if (!songIds.length) {
        let songs = JSON.parse(session.getItem(consts.LOVE_SONGS));
        this.commitLoveSongList({id: songs, isAll: true});
      }
    }
  },
  mounted() {
    this.initData();
    // 处理顺序播放完毕后刷新问题
    let isListEnded = session.getItem(consts.IS_LIST_ENDED);
    let num = window.parseInt(isListEnded);
    if (!Number.isNaN(num)) {
      if (num && this.songs) {
        this.$nextTick(() => {
          this.commitCurrentSong(this.songs[0].id);
        });
      }
    }
  },
  methods: {
    ...mapActions([
      'showMiNiAudio',
      'showSongList',
      'commitSongListData',
      'commitCurrentSong',
      'commitIsPlaying',
      'commitIsShowGraph',
      'commitSongCurrentTime',
      'commitHistorySongData',
      'commitIsEnded',
      'commitIsNextSong',
      'commitLoveSongList',
      'commitIsChangeAudio'
    ]),
    handleBarLeft(options) {
      let [left, type] = options;
      if (Number.isNaN(left)) {
        return;
      }
      let target = type === 'song' ? this.songBar : this.volumeBar;
      let radius = target.width - target.range[1] - 2;
      target.currentValue = (left + radius) / target.width * target.max;
    },
    getTargetSong(id) {
      let target = null;
      let songs = ApiData.lastLeftSongs;
      for (let index = 0, len = songs.length; index < len; index++) {
        let item = songs[index];
        if (item.id === id) {
          target = {target: item, index: index};
          break;
        }
      }
      return target;
    },
    setProgressToZero() {
      this.$set(this.songBar, 'width', 0);
    },
    /**
     * 初始化
     * 获取audio DOM节点对象
     * 获取精度条宽度以及滑块半径
     */
    initData() {
      this.getAudioData();
      let nodes = document.querySelectorAll('.run-way');
      let btns = document.querySelectorAll('.btn-wrapper');
      let songBarR = btns[0].offsetWidth / 2;
      let volumeBarR = btns[1].offsetWidth / 2;
      let sWidth = nodes[0].offsetWidth;
      let vWidth = nodes[1].offsetWidth;
      this.songBar.width = sWidth;
      this.volumeBar.width = vWidth;
      this.songBar.range = [-songBarR, sWidth - songBarR];
      this.volumeBar.range = [-volumeBarR, vWidth - volumeBarR];
      this.volumeBar.left = vWidth / 2;
    },
    // 左侧icon展开
    handleGraphClose() {
      this.isShowGraph = false;
    },
    /**
     * 当前播放模式
     * 0：顺序播放
     * 1：循环播放
     * 2：单曲循环播放
     * 3：随机播放
     */
    changePlayMode() {
      this.currentModeIndex = this.currentModeIndex + 1 > this.modes.length - 1 ? 0 : this.currentModeIndex + 1;
    },
    // 展开播放歌单列表
    openSongList() {
      this.showSongList(!this.getShowSongList);
    },
    // 获取audio中音频数据
    getAudioMetaData(e) {
      e.stopPropagation();
      let audioData = this.audioData;
      let {theAudio} = this.audioData;
      audioData.duration = theAudio.duration;
      audioData.formatDuration = formatSecToMinu(theAudio.duration);
      audioData.buffered = theAudio.buffered;
      audioData.currentVolume = theAudio.volume;
    },
    // 获取随机数
    getRandom(max) {
      return Math.floor(Math.random() * max);
    },
    /**
     * ended事件的回调函数
     * 主要处理：
     *   当前歌曲播放完毕，根据播放模式切换下一首歌曲
     */
    endedAudio(e) {
      this.commitIsEnded(true);
      if (!this.isHidden) {
        let limit = this.songs.length - 1;
        let currentIndex = this.currentSongIndex;
        switch (this.currentModeIndex) {
        case 0: currentIndex = currentIndex + 1 > limit ? null : currentIndex + 1;
          break;
        case 1: currentIndex = currentIndex + 1 > limit ? 0 : currentIndex + 1;
          break;
        case 3: (function(that) {
          let index = that.getRandom(limit + 1);
          currentIndex = index === currentIndex ? (currentIndex === limit ? 0 : currentIndex + 1) : index;
        })(this);
          break;
        }
        // 处理顺序播放结束后
        if (!currentIndex && currentIndex !== 0) {
          this.currentSong = null;
          this.commitCurrentSong();
          this.commitIsShowGraph(false);
          this.pause();
          this.isListEnded = true;
          this.setLeft(this.songBar, -100, true);
          session.setItem(consts.IS_LIST_ENDED, 1);
          return;
        }
        if (currentIndex !== this.currentSongIndex) {
          this.currentSongIndex = currentIndex;
          this.currentSong = this.songs[this.currentSongIndex];
          this.commitCurrentSong(this.currentSong.id);
        }
        this.isListEnded = false;
        this.play();
      } else if (this.getCurrentRoutePath !== '/selfFM') {
        if (!this.fmSongs.length) {
          this.fmSongs = ApiData.fmSongs;
          this.fmSongs.forEach((item, index) => {
            if (item.id === this.currentSong.id) {
              this.fmIndex = index;
            }
          });
        }
        let nextFmIndex = this.fmIndex + 1;
        this.fmIndex = nextFmIndex <= this.fmSongs.length - 1 ? nextFmIndex : this.fmIndex;
        this.commitCurrentSong(this.fmSongs[this.fmIndex].id);
      }
    },
    /**
     * timeupdate事件的回调函数
     * 主要处理：
     *   获取音频文件的播放当前时间
     */
    updateAudioTime(e) {
      e.stopPropagation();
      let audioData = this.audioData;
      let {theAudio} = audioData;
      audioData.currentTime = theAudio.currentTime;
      this.commitSongCurrentTime(audioData.currentTime);
    },
    /**
     * 获取audio DOM节点，并进行音频相关事件绑定
     * 事件：
     *   loadedmetadata: 音频文件加载成功后
     *   timeupdate: 音频播放中时间改变
     *   ended：播放结束
     */
    getAudioData() {
      let ad = this.audioData;
      let audio = document.getElementById('audio');
      ad.theAudio = audio;
      audio.volume = audio.volume / 2;
      audio.addEventListener('loadedmetadata', this.getAudioMetaData);
      audio.addEventListener('timeupdate', this.updateAudioTime);
      audio.addEventListener('ended', this.endedAudio);
    },
    // 播放
    play() {
      this.$nextTick(() => {
        this.isPlaying = true;
        this.audioData.theAudio.play();;
      });
    },
    // 暂停
    pause() {
      this.$nextTick(() => {
        this.isPlaying = false;
        this.audioData.theAudio.pause();
      });
    },
    // 判断指定class是否存在
    isExist(elem, className) {
      return String(elem.className).indexOf(className) >= 0;
    },
    /**
     * 音频控制条左侧区域点击事件
     * 上一首、下一首、播放、暂停
     */
    handleControlClick(e) {
      e.stopPropagation();
      let target = e.target;
      let isPlayIcon = false;
      let nodeName = String(target.nodeName).toLowerCase();
      console.log(this.isHidden);
      if (nodeName === 'span' || nodeName === 'i') {
        isPlayIcon = (this.isExist(target, 'prev') || this.isExist(target, 'fa-step-backward')) ? (function(that) {
          let currentIndex = that.currentSongIndex;
          that.currentSongIndex = currentIndex - 1 < 0 ? that.songs.length - 1 : currentIndex - 1;
          return false;
        })(this) : (this.isExist(target, 'next') || this.isExist(target, 'fa-step-forward') ? (function(that) {
          let currentIndex = that.currentSongIndex;
          that.currentSongIndex = currentIndex + 1 > that.songs.length - 1 ? 0 : currentIndex + 1;
          return false;
        })(this) : Boolean(true));
        if (this.isHidden && !isPlayIcon) {
          this.commitIsNextSong(true);
          return;
        }
        isPlayIcon ? (function(that) {
          !that.isPlaying ? (function() {
            if (that.isListEnded) {
              that.commitCurrentSong(that.songs[0].id);
              that.commitIsShowGraph(true);
            }
            that.play();
          }()) : that.pause();
        })(this) : (function(that) {
          that.currentSong = that.songs[that.currentSongIndex];
          that.commitCurrentSong(that.currentSong.id);
          that.play();
        })(this);
      }
    },
    // 浮动控制条
    openMiNiAudio() {
      this.showMiNiAudio(!this.getShowMiNiAudio);
    },
    // 将进度转换为时间
    leftToCurrentTime(target, isIgnoreR) {
      let {duration, theAudio} = this.audioData;
      let {width, max, range, left} = target;
      let radius = width - range[1];
      let precision = isIgnoreR ? left / width * max : (left + radius) / width * max;
      let currentTime = Math.min(duration * precision * 0.01, duration);
      theAudio.currentTime = currentTime;
    },
    // 将进度转换为音量
    leftToVolume(target, isIgnoreR) {
      let {theAudio} = this.audioData;
      let {width, max, range, left} = target;
      let radius = width - range[1];
      let precision = isIgnoreR ? left / width * max : (left + radius) / width * max;
      let currentVolume = Math.max(0, Math.min(precision * 0.01, 1));
      theAudio.volume = currentVolume;
    },
    // 设置进度
    setLeft(target, clientX, isDragEnd) {
      let range = target.range;
      let left = Math.max(range[0], Math.min(clientX - target.initClientX, range[1]));
      delete target.left;
      this.$set(target, 'left', left);
      if (!this.isVolumeBtn && isDragEnd) {
        this.leftToCurrentTime(target);
      } else if (this.isVolumeBtn && isDragEnd) {
        this.leftToVolume(target);
      }
    },
    // 判断是音频进度还是声音进度
    getCurrentTarget() {
      return !this.isVolumeBtn ? this.songBar : this.volumeBar;
    },
    // 进度条点击事件处理
    handleClickBar(e, type) {
      e.stopPropagation();
      if (!this.currentSong) {
        return;
      }
      let [isVolumeBtn, target] = type === 'song' ? [false, this.songBar] : [true, this.volumeBar];
      this.isVolumeBtn = isVolumeBtn;
      this.setLeft(target, e.offsetX + target.range[0], true);
    },
    // 音频滑块点击事件处理
    hanldeSongButtonDown(e) {
      this.isVolumeBtn = false;
      this.hanldeButtonDown(e);
    },
    // 声音滑块点击事件处理
    hanldeVolumeButtonDown(e) {
      this.isVolumeBtn = true;
      this.hanldeButtonDown(e);
    },
    /**
     * 拖动功能的实现
     * hanldeButtonDown: 统一mousedown处理
     * handleDragStart: 开始拖动时
     * handleDrag：拖动中
     * handleDragEnd: 拖动结束时
     */
    hanldeButtonDown(e) {
      e.stopPropagation();
      e.preventDefault();
      this.handleDragStart(e.clientX);
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.handleDragEnd);
    },
    handleDragStart(clientX) {
      let target = this.getCurrentTarget();
      target.initClientX = target.initClientX ? target.initClientX : clientX;
      target.dragging = true;
    },
    handleDrag(e) {
      e.stopPropagation();
      let target = this.getCurrentTarget();
      if (target.dragging) {
        this.setLeft(target, e.clientX);
      }
    },
    handleDragEnd(e) {
      e.stopPropagation();
      let target = this.getCurrentTarget();
      if (target.dragging) {
        setTimeout(() => {
          target.dragging = false;
          this.setLeft(target, e.clientX, true);
        }, 0);
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleDragEnd);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import '../less/common-slider.less';
.audio {
  color: #79797B;
  height: 100%;
  overflow: hidden;
  .container {
    list-style: none;
    .item {
      float: left;
      height: 50px;
      line-height: 50px;
      .icon {
       display: inline-block;
       cursor: pointer;
      }
    }
    .control {
      width: 190px;
      .icon {
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        border-radius: 50%;
        &:hover {
          border: 1px solid rgba(255, 255, 255, .6) !important;
        }
        &:nth-of-type(2) {
          width: 35px;
          height: 35px;
          line-height: 35px;
          margin: 0 20px;
        }
      }
    }
    .progress {
      width: calc(~"100% - 490px");
      label,
      .run-way {
        display: inline-block;
        height: 30px;
        line-height: 30px;
      }
      label {
        width: 50px;
      }
      .run-way {
        .slider-block(5px, calc(~"100% - 130px"), #454546, 18px);
      }
    }
    .volume {
      width: 150px;
      .icon {
        width: 30px;
        font-size: 16px;
      }
      .run-way {
        .slider-block(4px, 110px, #171719, 16px);
      }
    }
    .song-about {
      width: 150px;
      .icon {
        width: 25px;
        &:nth-of-type(2) {
          width: 17px;
          height: 17px;
          line-height: 17px;
          border: 1px solid #656668;
          margin-left: 10px;
        }
        &:nth-of-type(2):hover {
          border: 1px solid #fff;
        }
      }
      .song-list {
        font-size: 15px;
        width: 42px;
        height: 15px;
        line-height: 15px;
        margin-left: 20px;
        text-align: left;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        // background: rgba(48, 50, 54, .6);
        .size {
          // color: #fff;
          font-size: 10px;
          margin-left: 5px;
        }
      }
    }
    .is-other-theme {
      .volume,
      .song-about {
        .icon {
          &:hover {
            color: rgba(68, 68, 68, 1);
          }
        }
      }
    }
  }
}
</style>