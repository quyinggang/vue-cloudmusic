<template>
  <section
    class="mini-audio"
    draggable="true"
    @dragstart="handleDragStart"
    @drag="handleDrag"
    @dragend="handleDragEnd"
    :style="miniAudioStyle">
    <ul class="header">
      <li class="item" v-for="(item, index) in items" :key="index">
        <span :class="item.className" @click="handleClickIcon(item)">
          <i :class="item.icon"></i>
        </span>
      </li>
    </ul>
    <p class="content">{{currentLyric}}</p>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import apiData from '@/api/data';
import { formatLyric } from '@/utils/format';
export default {
  name: 'mn-audio',
  data() {
    return {
      items: [
        {className: 'prev', icon: 'fa fa-step-backward'},
        {className: 'play', icon: 'fa fa-play'},
        {className: 'next', icon: 'fa fa-step-forward'},
        {className: 'settings', icon: 'fa fa-gear'},
        {className: 'close', icon: 'fa fa-close'}
      ],
      currentSong: null,
      currentSongIndex: 0,
      lyrics: {
        times: [],
        contents: []
      },
      currentLyric: '',
      drag: {
        isDrag: false,
        width: 0,
        height: 0,
        clientX: 0,
        clientY: 0,
        xMax: 0,
        yMax: 0
      }
    };
  },
  computed: {
    ...mapGetters([
      'getShowMiNiAudio',
      'getCurrentSong',
      'getSongCurrentTime',
      'getIsPlaying',
      'getSongListData'
    ]),
    miniAudioStyle() {
      let {clientX, clientY} = this.drag;
      if (clientX && clientY) {
        return {left: `${clientX}px`, top: `${clientY}px`};
      }
    }
  },
  watch: {
    getShowMiNiAudio(isShow) {
      if (isShow && !this.drag.width) {
        let pNode = document.querySelector('.mini-audio');
        this.drag.width = pNode.offsetWidth;
        this.drag.height = pNode.offsetHeight;
      }
    },
    getCurrentSong(id) {
      if (id) {
        this.getSongAbout(id);
      }
    },
    getSongCurrentTime(currentTime) {
      let times = this.lyrics.times;
      for (let index = 0, len = times.length; index < len; index++) {
        if (Math.abs(currentTime - times[index]) <= 0.3) {
          this.currentLyric = this.lyrics.contents[index];
          break;
        }
      }
    },
    getIsPlaying(isPlay) {
      let data = isPlay ? ['pause', 'fa fa-pause'] : ['play', 'fa fa-play'];
      let item = {className: data[0], icon: data[1]};
      this.items.splice(1, 1, item);
    }
  },
  mounted() {
    this.getSongAbout(this.getCurrentSong);
  },
  methods: {
    ...mapActions([
      'showMiNiAudio',
      'commitIsPlaying',
      'commitCurrentSong'
    ]),
    getSongAbout(id) {
      if (!id || Number.isNaN(window.parseInt(id))) {
        return;
      }
      this.currentSong = this.getCurrentSongObj(id);
      this.getLyric();
    },
    getLyric() {
      let [times, contents] = formatLyric(this.currentSong.lyric);
      this.lyrics.contents = contents;
      this.lyrics.times = times.map((item) => {
        let [minute, secs] = String(item).split(':');
        let formatTime = window.parseInt(minute) * 60 + window.parseFloat(secs);
        return formatTime;
      });
    },
    getCurrentSongObj(id) {
      let target = null;
      let data = apiData.lastLeftSongs;
      for (let index = 0, len = data.length; index < len; index++) {
        if (data[index].id === id) {
          this.currentSongIndex = index;
          target = data[index];
          break;
        }
      }
      return target;
    },
    handleClickIcon(item) {
      let className = item.className;
      let listSum = this.getSongListData.filter((item) => {
        if (item) {
          return item;
        }
      }).length;
      switch (className) {
      case 'close':
        this.showMiNiAudio(false);
        break;
      case 'play':
        this.commitIsPlaying(true);
        break;
      case 'pause':
        this.commitIsPlaying(false);
        break;
      case 'prev':
        (function(that) {
          that.currentSongIndex = that.currentSongIndex - 1 < 0 ? listSum - 1 : that.currentSongIndex - 1;
          that.changeCurrentSong();
        })(this);
        break;
      case 'next':
        (function(that) {
          that.currentSongIndex = that.currentSongIndex + 1 > listSum - 1 ? 0 : that.currentSongIndex + 1;
          that.changeCurrentSong();
        })(this);
        break;
      }
    },
    changeCurrentSong() {
      this.currentSong = apiData.lastLeftSongs[this.currentSongIndex];
      this.getLyric();
      this.commitCurrentSong(this.currentSong.id);
    },
    setPosition(clientX, clientY) {
      let drag = this.drag;
      drag.clientX = Math.max(0, Math.min(clientX, drag.xMax));
      drag.clientY = Math.max(0, Math.min(clientY, drag.yMax));
    },
    handleDragStart(e) {
      e.stopPropagation();
      let drag = this.drag;
      drag.isDrag = true;
      drag.yMax = window.innerHeight - drag.height;
      drag.xMax = window.innerWidth - drag.width / 2;
    },
    handleDrag(e) {
      e.stopPropagation();
      if (this.drag.isDrag) {
        this.setPosition(e.clientX, e.clientY);
      }
    },
    handleDragEnd(e) {
      e.stopPropagation();
      if (this.drag.isDrag) {
        this.setPosition(e.clientX, e.clientY);
        this.drag.isDrag = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.mini-audio {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 80px;
  border: 1px solid rgba(0, 0, 0, .5);
  box-shadow: 0 0 1px 1px #3C3D40 inset,
              0 0 2px 1px #4E4F52;
  background: rgba(35, 37, 41, .2);
  transform: translate(-50%, -50%);
  z-index: 999;
  cursor: move;
  .header {
    padding-top: 10px;
    box-sizing: border-box;
    list-style: none;
    .item {
      display: inline-block;
      width: 30px;
      cursor: pointer;
    }
  }
  .content {
    font-size: 20px;
    margin: 10px 0 0 0;
    text-shadow: 0 0 5px #B82525;
  }
}
</style>
