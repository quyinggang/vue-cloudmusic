<template>
  <section class="player">
    <div class="player-wrapper" @click="handleIconClick">
      <div class="video-box" v-show="src">
        <span class="icon pause" v-show="!isPlayEnded && !isPlaying">
          <i class="fa fa-play"></i>
        </span>
        <span class="icon" v-show="isPlayEnded" @click="handleRePlay">
          <i class="fa fa-rotate-left"></i>
          重播
        </span>
      </div>
      <video preload="true" autoplay id="video">
        <source :src="src" type="video/mp4">
      </video>
    </div>
    <div :class="controlClass">
      <div class="progress">
        <div class="run-way" @click="handleClickBar($event, 'mv')">
          <div class="bar" :style="mvBarStyle">
            <div class="buffer"></div>
            <div class="btn-wrapper"
              @mousedown="hanldeMVButtonDown">
              <div class="btn"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="left">
        <span class="icon" @click="handleIconClick">
          <i :class="[isPlaying ? classes.pause : classes.play]"></i>
        </span>
        <span class="current-time">{{getCurrentTime}}</span>
        <span>/</span>
        <span class="duration">{{videoData.formatDuration}}</span>
      </div>
      <div class="right">
        <span class="icon">
          <i class="fa fa-volume-up"></i>
        </span>
        <div class="volume">
          <div class="run-way" @click="handleClickBar($event, 'volume')">
            <div class="bar" :style="volumeBarStyle">
              <div class="btn-wrapper"
                @mousedown="hanldeVolumeButtonDown">
                <div class="btn"></div>
              </div>
            </div>
          </div>
        </div>
        <span class="icon full-page" @click="handleFullScreen">
          <i :class="[isFullScreen ? classes.expand : classes.compress]"></i>
        </span>
      </div>
    </div>
  </section>
</template>

<script>
import { formatSecToMinu } from '@/utils/format';
export default {
  name: 'vue-video',
  props: ['src'],
  data() {
    return {
      isFullScreen: false,
      isPlaying: true,
      isPlayEnded: false,
      isSlideFade: true,
      isVolumeBtn: false,
      mvBar: {
        left: -4,
        width: 0,
        max: 100,
        currentValue: 0,
        dragging: false,
        range: null,
        initClientX: 0,
        offset: 0
      },
      volumeBar: {
        left: -8,
        width: 0,
        max: 100,
        currentValue: 0,
        dragging: false,
        range: null,
        initClientX: 0
      },
      videoData: {
        theVideo: null,
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
        expand: 'fa fa-expand',
        compress: 'fa fa-compress',
        control: 'player-controller',
        isAbsolute: 'is-absolute',
        slideFadeOut: 'slide-fade-out',
        slideFadeIn: 'slide-fade-in'
      }
    };
  },
  computed: {
    mvBarStyle() {
      return {width: `${this.mvBar.currentValue}%`};
    },
    volumeBarStyle() {
      return {width: `${this.volumeBar.currentValue}%`};
    },
    mvBarLeft() {
      return [this.mvBar.left, 'mv'];
    },
    volumeBarLeft() {
      return [this.volumeBar.left, 'volume'];
    },
    controlClass() {
      let classes = this.classes;
      return [classes.control, this.isFullScreen ? (this.parentSlideFade ? `${classes.isAbsolute} ${classes.slideFadeOut}` : `${classes.isAbsolute} ${classes.slideFadeIn}`) : ''];
    },
    parentSlideFade() {
      this.isSlideFade = this.$parent.$data.isSlideFade;
      return this.isSlideFade;
    },
    getCurrentTime() {
      let {currentTime, duration} = this.videoData;
      let precision = currentTime / duration;
      let mvBar = this.mvBar;
      let {width, range, max} = mvBar;
      if (range) {
        this.$set(mvBar, 'left', Math.min(precision * max * 0.01 * width, range[1]));
      }
      return formatSecToMinu(this.videoData.currentTime);
    },
    getCurrentVolume() {
      return this.videoData.currentVolume;
    }
  },
  watch: {
    mvBarLeft: 'handleBarLeft',
    volumeBarLeft: 'handleBarLeft',
    // 音量
    getCurrentVolume(val) {
      let percision = val * 100;
      let {range} = this.volumeBar;
      if (range) {
        this.$set(this.volumeBar, 'left', Math.min(percision, range[1]));
      }
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.getVideoData();
      let nodes = document.querySelectorAll('.run-way');
      let btns = document.querySelectorAll('.btn');
      let mvBarR = btns[0].offsetWidth / 2;
      let volumeBarR = btns[1].offsetWidth / 2;
      let sWidth = nodes[0].offsetWidth;
      let vWidth = nodes[1].offsetWidth;
      this.mvBar.width = sWidth;
      this.volumeBar.width = vWidth;
      this.mvBar.range = [-mvBarR, sWidth - (mvBarR * 2)];
      this.volumeBar.range = [-volumeBarR, vWidth - volumeBarR];
      this.volumeBar.left = vWidth / 2;
    },
    /**
     * 获取video DOM节点，并进行视频相关事件绑定
     * 事件：
     *   loadedmetadata: 视频文件加载成功后
     *   timeupdate: 视频播放中时间改变
     *   ended：播放结束
     */
    getVideoData() {
      let vd = this.videoData;
      let video = document.getElementById('video');
      vd.theVideo = video;
      video.volume = video.volume / 2;
      video.addEventListener('loadedmetadata', this.getVideoMetaData);
      video.addEventListener('timeupdate', this.updateVideoTime);
      video.addEventListener('ended', this.endedVideo);
    },
    // 获取video中数据
    getVideoMetaData(e) {
      e.stopPropagation();
      let videoData = this.videoData;
      let {theVideo} = this.videoData;
      videoData.duration = theVideo.duration;
      videoData.formatDuration = formatSecToMinu(theVideo.duration);
      videoData.buffered = theVideo.buffered;
      videoData.currentVolume = theVideo.volume;
    },
    /**
     * ended事件的回调函数
     * 主要处理：
     *   当前歌曲播放完毕，根据播放模式切换下一首歌曲
     */
    endedVideo(e) {
      e.stopPropagation();
      this.isPlaying = false;
      this.isPlayEnded = true;
    },
    /**
     * timeupdate事件的回调函数
     * 主要处理：
     *   获取视频文件的播放当前时间
     */
    updateVideoTime(e) {
      e.stopPropagation();
      let videoData = this.videoData;
      let {theVideo} = videoData;
      videoData.currentTime = theVideo.currentTime;
    },
    // 重播
    handleRePlay() {
      this.isPlayEnded = false;
      this.play();
    },
    // 将进度转换为时间
    leftToCurrentTime(target, isIgnoreR) {
      let {duration, theVideo} = this.videoData;
      let {width, max, range, left} = target;
      let radius = width - range[1];
      let precision = isIgnoreR ? left / width * max : (left + radius) / width * max;
      let currentTime = Math.min(duration * precision * 0.01, duration);
      theVideo.currentTime = currentTime;
    },
    // 将进度转换为音量
    leftToVolume(target, isIgnoreR) {
      let {theVideo} = this.videoData;
      let {width, max, range, left} = target;
      let radius = width - range[1];
      let precision = isIgnoreR ? left / width * max : (left + radius) / width * max;
      let currentVolume = Math.max(0, Math.min(precision * 0.01, 1));
      theVideo.volume = currentVolume;
    },
    handleBarLeft(options) {
      let [left, type] = options;
      let target = type === 'mv' ? this.mvBar : this.volumeBar;
      let radius = target.width - target.range[1];
      target.currentValue = (left + radius) / target.width * target.max;
    },
    handleFullScreen() {
      this.isFullScreen = !this.isFullScreen;
      this.$emit('fullScreen', this.isFullScreen);
    },
    play() {
      this.$nextTick(() => {
        this.isPlaying = true;
        this.videoData.theVideo.play();
      });
    },
    pause() {
      this.isPlaying = false;
      this.videoData.theVideo.pause();
    },
    handleIconClick() {
      this.isPlaying ? this.pause() : this.play();
    },
    handleClickBar(e, type) {
      e.stopPropagation();
      let [isVolumeBtn, target] = type === 'mv' ? [false, this.mvBar] : [true, this.volumeBar];
      this.isVolumeBtn = isVolumeBtn;
      this.$set(target, 'left', e.offsetX);
      if (type === 'mv') {
        this.leftToCurrentTime(target, true);
      } else {
        this.leftToVolume(target, true);
      }
    },
    hanldeMVButtonDown(e) {
      e.stopPropagation();
      this.isVolumeBtn = false;
      this.hanldeButtonDown(e);
    },
    hanldeVolumeButtonDown(e) {
      e.stopPropagation();
      this.isVolumeBtn = true;
      this.hanldeButtonDown(e);
    },
    setLeft(target, clientX, isDragEnd) {
      let range = target.range;
      let left = Math.max(range[0], Math.min(clientX - target.initClientX, range[1]));
      this.$set(target, 'left', left);
      if (!this.isVolumeBtn && isDragEnd) {
        this.leftToCurrentTime(target);
      } else if (this.isVolumeBtn && isDragEnd) {
        this.leftToVolume(target);
      }
    },
    getCurrentTarget() {
      return !this.isVolumeBtn ? this.mvBar : this.volumeBar;
    },
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
.full {
  width: 100%;
  height: 100%;
}
.slide-fade-in {
  transform: translateY(0);
  transition: transform 300ms linear;
}
.slide-fade-out {
  transform: translateY(100%);
  transition: transform 300ms linear;
}
.player {
  .full;
  .icon {
    cursor: pointer;
  }
  .player-wrapper {
    position: relative;
    .video-box {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 30px;
      transform: translate(-50%, -50%);
      z-index: 2;
      .pause {
        display: inline-block;
        width: 60px;
        height: 60px;
        line-height: 60px;
        color: #fff;
        text-align: center;
        border: 2px solid rgba(157, 157, 157, 1);
        border-radius: 50%;
        box-sizing: border-box;
        background: rgba(0, 0, 0, .4);
        cursor: pointer;
        &:hover {
          border-color: #fff;
        }
      }
    }
    #video {
      display: block;
      width: 100%;
    }
  }
  .player-controller {
    height: 40px;
    background: rgba(17, 17, 17, 1);
    .left,
    .right {
      display: inline-block;
      width: 50%;
      height: 35px;
      line-height: 35px;
      overflow: hidden;
    }
    .progress {
      height: 5px;
      width: 100%;
      .run-way {
        position: relative;
        height: 5px;
        background: #454546;
        cursor: pointer;
        .slider-block-bar(18px);
      }
    }
    .left {
      margin-right: -4px;
      text-align: left;
      > span {
        display: inline-block;
        text-align: center;
        &:first-child {
          width: 25px;
          height: 25px;
          line-height: 25px;
          margin: 0 8px 0 20px;
          border: 1px solid rgba(157, 157, 157, 1);
          border-radius: 50%;
          box-sizing: border-box;
        }
      }
    }
    .right {
      text-align: right;
      .volume {
        display: inline-block;
        margin-left: 8px;
        .run-way {
          .slider-block(4px, 110px, rgba(40, 40, 40, 1), 16px);
        }
      }
      .full-page {
        display: inline-block;
        padding: 0 15px;
        text-align: center;
      }
    }
  }
  .is-absolute {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
}
</style>