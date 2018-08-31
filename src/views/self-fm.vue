<template>
  <section class="self-fm">
    <div class="song-control">
      <ul class="container">
        <li :class="[classes.item, item.status === 0 ? classes.active : (item.status === -1 ? classes.left : '')]" 
          v-for="(item, index) in songs" :key="index"
          @click="handleSwitchLeftSong(item)">
          <span :class="[classes.icon, item.isPlay ? classes.isPlay : '']" @click="handleIconClick(item, index)">
            <i :class="[item.isPlay ? classes.pause : classes.play]"></i>
          </span>
          <img :src="item.imgUrl" alt="image">
        </li>
      </ul>
      <ul class="control">
        <li class="control-item" :style="bgStyle">
          <i :class="[currentSong.isLove ? classes.redHeart : classes.heart]" @click="handleCollectSong"></i>
        </li>
        <li class="control-item" @click="handleDelete" :style="bgStyle">
          <i class="fa fa-trash-o"></i>
        </li>
        <li class="control-item" @click="handleSwitchSong" :style="switchStyle">
          <i class="fa fa-step-forward"></i>
        </li>
        <li class="control-item" :style="bgStyle">
          ...
        </li>
      </ul>
    </div>
    <div class="song-detail">
      <div class="info">
        <h2>{{currentSong.name}}</h2>
        <label>专辑：{{currentSong.album | albumFilter}}</label>
        <label>歌手：{{currentSong.author}}</label>
      </div>
      <div class="lyric-box">
        <scroll :scrollIndex="scrollIndex" :total="this.lyrics.contents.length">
          <div class="lyric">
            <p v-for="(item, index) in lyrics.times" :key="index"
                :class="[!lyrics.contents[index] ? classes.empty : '', item.isActive ? classes.active : '']">
              {{lyrics.contents[index]}}
            </p>
          </div>
        </scroll>
      </div>
    </div>
    <collect-message :message="message"></collect-message>
  </section>
</template>

<script>
import apiData from '@/api/data';
import { formatLyric } from '@/utils/format';
import scroll from '@/components/scroll';
import { mapGetters, mapActions } from 'vuex';
import MixinCollectMsg from '@/mixins/mixin-collectmsg';
import MixinTheme from '@/mixins/mixin-theme';
export default {
  name: 'self-fm',
  components: {
    scroll
  },
  mixins: [MixinCollectMsg, MixinTheme],
  data() {
    return {
      isSelfFMPlay: false,
      isCanSwitch: true,
      lyrics: {
        times: [],
        contents: []
      },
      theme: null,
      scrollIndex: 0,
      currentIndex: 0,
      currentSong: null,
      songs: null,
      classes: {
        item: 'item',
        active: 'active',
        left: 'left',
        icon: 'icon',
        empty: 'empty-line',
        isPlay: 'is-playing',
        play: 'fa fa-play',
        pause: 'fa fa-pause',
        heart: 'fa fa-heart-o',
        redHeart: 'fa fa-heart'
      }
    };
  },
  filters: {
    albumFilter(val) {
      return (String(val).length > 8 ? String(val).substr(0, 8) + '...' : val);
    }
  },
  computed: {
    ...mapGetters([
      'getSongCurrentTime',
      'getIsEnded',
      'getIsPlaying',
      'getIsNextSong',
      'getCurrentSong',
      'getIsChangeAudio',
      'getLoveSongList'
    ]),
    switchStyle() {
      let bgStyle = this.bgStyle;
      return {cursor: this.isCanSwitch ? 'pointer' : 'no-allow', ...bgStyle};
    },
    bgStyle() {
      let audio = this.theme.audio;
      let bg = 'rgba(38, 39, 43, .8)';
      let border = null;
      if (audio !== 'transparent') {
        border = `1px solid ${bg}`;
        bg = 'transparent';
      }
      return border ? {background: bg, border: border} : {background: bg};
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.getIsChangeAudio) {
        vm.isSelfFMPlay = true;
      }
      // session.setItem(consts.HISTORY_CURRENT_SONG, vm.getCurrentSong);
    });
  },
  beforeRouteLeave(to, from, next) {
    this.commitIsShowGraph(true);
    // this.commitIsChangeAudio(false);
    // this.commitCurrentSong(session.getItem(consts.HISTORY_CURRENT_SONG));
    // session.removeItem(consts.HISTORY_CURRENT_SONG);
    next();
  },
  watch: {
    getSongCurrentTime(currentTime) {
      if (!this.isSelfFMPlay) {
        return;
      }
      let times = this.lyrics.times;
      for (let index = 0, len = times.length; index < len; index++) {
        let item = times[index];
        if (Math.abs(currentTime - item.time) <= 0.3) {
          if (index) {
            for (let count = 0; count < index; count++) {
              this.$set(times[count], 'isActive', false);
            }
          }
          this.scrollIndex = index;
          this.$set(item, 'isActive', true);
          break;
        }
      }
    },
    getIsEnded(isEnded) {
      if (isEnded) {
        this.nextSong();
      }
    },
    getIsNextSong(isNext) {
      if (isNext) {
        this.nextSong();
        this.commitIsNextSong(false);
      }
    }
  },
  created() {
    this.songs = apiData.fmSongs.map((item, index) => {
      // 0 当前 1下一首 -1上一首
      item.status = index ? 1 : 0;
      item.isPlay = false;
      return item;
    });
    // 处理fm播放首次进入一级退出再次进入
    if (this.getCurrentSong && this.getIsChangeAudio) {
      let {index} = this.getTargetSong(this.getCurrentSong);
      if (index) {
        this.currentIndex = index - 1 < 0 ? 0 : index - 1;
        this.nextSong();
      } else {
        this.setInitSongAbout();
        this.$set(this.currentSong, 'isPlay', true);
      }
    } else {
      this.setInitSongAbout();
      if (this.getIsChangeAudio) {
        this.changeCurrentSong(this.currentSong.id, false);
      }
    }
    this.isCanSwitch = this.songs.length > 0 ? Boolean(true) : false;
  },
  methods: {
    ...mapActions([
      'commitCurrentSong',
      'commitIsPlaying',
      'commitIsChangeAudio',
      'commitIsEnded',
      'commitIsShowGraph',
      'commitLoveSongList',
      'commitIsNextSong'
    ]),
    setSognIsLove() {
      if (this.currentSong) {
        this.$set(this.currentSong, 'isLove', this.getTargetLoveSong());
      }
    },
    getTargetLoveSong() {
      let loveSongs = [...this.getLoveSongList];
      for (let index = 0, len = loveSongs.length; index < len; index++) {
        let songId = loveSongs[index];
        if (this.currentSong && this.currentSong.id === songId) {
          return true;
        }
      }
    },
    setInitSongAbout() {
      this.currentSong = this.songs[0];
      this.currentIndex = 0;
      this.getLyric();
    },
    nextSong() {
      let nextIndex = this.currentIndex + 1;
      if (nextIndex <= this.songs.length - 1) {
        this.currentSong = this.songs[nextIndex];
        this.currentIndex = nextIndex;
        this.$set(this.songs[nextIndex - 1], 'status', -1);
        this.$set(this.currentSong, 'status', 0);
        this.changeCurrentSong(this.currentSong.id, true);
        this.commitIsEnded(false);
      }
    },
    getTargetSong(id) {
      let target = null;
      let songs = this.songs;
      for (let index = 0, len = songs.length; index < len; index++) {
        let item = songs[index];
        if (item.id === id) {
          target = {target: item, index: index};
          break;
        }
      }
      return target;
    },
    changeCurrentSong(id, isPlay) {
      this.getLyric();
      this.$set(this.currentSong, 'isPlay', isPlay);
      this.commitCurrentSong(id);
      this.setSognIsLove();
      if (this.isSelfFMPlay) {
        this.commitIsPlaying(isPlay);
      }
    },
    getLyric() {
      let [times, contents] = formatLyric(this.currentSong.lyric);
      this.lyrics.contents = contents;
      this.lyrics.times = times.map((item) => {
        let [minute, secs] = String(item).split(':');
        let formatTime = window.parseInt(minute) * 60 + window.parseFloat(secs);
        return {isActive: false, time: formatTime};
      });
    },
    handleIconClick(item, index) {
      this.commitIsPlaying(false);
      this.$set(item, 'isPlay', !item.isPlay);
      this.songs.splice(index, 1, item);
      if (item.isPlay) {
        this.isSelfFMPlay = true;
        this.commitIsChangeAudio(true);
        this.commitCurrentSong(item.id);
      } else {
        this.isSelfFMPlay = false;
      }
      this.commitIsPlaying(item.isPlay);
    },
    handleCollectSong() {
      let isLove = this.currentSong.isLove;
      let operator = isLove ? 'delete' : 'add';
      this.$set(this.currentSong, 'isLove', !isLove);
      this.message.isShow = true;
      this.message.status = operator;
      this.commitLoveSongList({id: this.currentSong.id, operator: operator});
    },
    handleDelete() {
    },
    handleSwitchLeftSong(item) {
      if (item.status !== -1) {
        return;
      }
      this.currentSong.status = 1;
      this.currentSong = item;
      this.currentIndex -= 1;
      this.currentSong.status = 0;
      this.isSelfFMPlay = true;
      this.commitIsChangeAudio(true);
      this.changeCurrentSong(this.currentSong.id, true);
    },
    handleSwitchSong() {
      if (this.currentIndex + 1 <= this.songs.length - 1) {
        if (this.currentIndex + 1 === this.songs.length - 1) {
          this.isCanSwitch = false;
        }
        this.currentSong.status = -1;
        this.currentIndex += 1;
        this.currentSong = this.songs[this.currentIndex];
        this.currentSong.status = 0;
        this.isSelfFMPlay = true;
        this.commitIsChangeAudio(true);
        this.changeCurrentSong(this.currentSong.id, true);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.self-fm {
  padding-top: 50px;
  .song-control,
  .song-detail {
    display: inline-block;
    width: 300px;
  }
  .song-control {
    .container {
      position: relative;
      width: 300px;
      height: 300px;
      list-style: none;
      .item {
        position: absolute;
        width: 300px;
        height: 300px;
        transform: translateX(100%);
        opacity: 0;
      }
      .left {
        transform: scale(.9) translateX(-30%);
        opacity: 1;
        z-index: 10;
        transition: transform 400ms ease-in-out,
                    opacity 400ms linear;
        cursor: pointer;
      }
      .active {
        transform: translateX(0);
        transition: transform 400ms ease-in-out,
                    opacity 500ms linear;
        opacity: 1;
        z-index: 100;
      }
      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 18px;
        color: #fff;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, .7);
        transform: translate(-50%, -50%);
        transition: transform 500ms ease;
        cursor: pointer;
        &:hover {
          border-color: rgba(255, 255, 255, 1);
        }
      }
      .is-playing {
        transform: scale(0.8) translate(280%, 280%);
      }
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .control {
      height: 80px;
      line-height: 80px;
      list-style: none;
      .control-item {
        display: inline-block;
        width: 40px;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        text-align: center;
        margin-right: 28px;
        border-radius: 50%;
        cursor: pointer;
        .fa-heart {
          color: #B82525;
        }
        &:hover {
          // color: #fff;
          background: rgba(245, 245, 247, 1);
        }
        &:last-child {
          margin: 0;
        }
      }
    }
  }
  .song-detail {
    position: relative;
    width: 280px;
    margin-left: 30px;
    text-align: left;
    z-index: 100;
    .info {
      height: 80px;
      label {
        display: inline-block;
        width: 60%;
        &:last-child {
          width: auto;
          text-align: center;
        }
      }
    }
    .lyric-box {
      position: relative;
      height: 300px;
      overflow: hidden;
      .lyric {
        p {
          color: #5F5F63;
          letter-spacing: 0.3px;
          line-height: 20px;
        }
        .empty-line {
          height: 1px;
        }
        .active {
          color: #fff;
        }
      }
    }
  }
}
</style>
