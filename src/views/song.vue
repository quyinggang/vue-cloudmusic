<template>
  <section class="single-song">
    <div class="bg" :style="bgStyle"></div>
    <div class="content">
      <div class="song-control">
        <div :class="[classes.stylus, isPlaying ? classes.isPlay : classes.isPause]">
          <img src="../assets/images/stylus.png" alt="image">
        </div>
        <div :class="[classes.cirlce, isPlaying ? classes.rotate : '']">
          <div class="container">
            <img :src="currentSong ? currentSong.imgUrl : ''" alt="image">
          </div>
        </div>
        <ul class="control">
          <li class="control-item" @click="handleSignSong">
            <i :class="[currentSong && currentSong.isLove ? classes.redHeart : classes.heartO]"></i>
            <span class="white">喜欢</span>
          </li>
        </ul>
      </div>
      <div class="song-detail">
        <div class="info">
          <h2>{{currentSong && currentSong.name}}</h2>
          <label>专辑：{{currentSong && currentSong.album | albumFilter}}</label>
          <label>歌手：{{currentSong && currentSong.author}}</label>
        </div>
        <div class="lyric-box">
          <scroll :scrollIndex="scrollIndex" :total="this.lyrics.contents.length">
            <div class="lyric">
              <p
                v-for="(item, index) in lyrics.times"
                :key="index"
                :class="[item.isActive ? classes.active : '']">
                {{lyrics.contents[index]}}
              </p>
            </div>
          </scroll>
        </div>
      </div>
      <span class="icon back" @click="back">
        <i class="fa fa-compress"></i>
      </span>
    </div>
  </section>
</template>

<script>
import { formatLyric } from '@/utils/format';
import session from '@/api/persist-data';
import * as consts from '@/api/consts';
import apiData from '@/api/data';
import {mapActions, mapGetters} from 'vuex';
import scroll from '@/components/scroll';
export default {
  name: 'self-fm',
  components: {
    scroll
  },
  data() {
    return {
      lyrics: {
        times: [],
        contents: []
      },
      height: 0,
      isPlaying: false,
      currentSong: null,
      scrollIndex: 0,
      classes: {
        stylus: 'stylus',
        cirlce: 'circle-panel',
        rotate: 'is-rotate',
        isRotatePause: 'is-pause-rotate',
        item: 'item',
        active: 'active',
        left: 'left',
        icon: 'icon',
        isPlay: 'is-playing',
        isPause: 'is-pause',
        play: 'fa fa-play',
        pause: 'fa fa-pause',
        heartO: 'fa fa-heart-o',
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
      'getIsPlaying',
      'getSongCurrentTime',
      'getCurrentSong',
      'getSongListData'
    ]),
    bgStyle() {
      if (this.currentSong && this.height) {
        return {height: `${this.height}px`, backgroundImage: `url(${this.currentSong.imgUrl})`, filter: 'blur(15px)'};
      }
    }
  },
  watch: {
    getIsPlaying(val) {
      this.isPlaying = val;
    },
    getSongCurrentTime(currentTime) {
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
    getCurrentSong(id) {
      if (!id) {
        return;
      }
      this.currentSong = this.getCurrentSongObj(id);
      this.getLyric();
      this.scrollIndex = 0;
    }
  },
  beforeRouteLeave(to, from, next) {
    let isShowGraph = this.getSongListData && this.getSongListData.length ? Boolean(true) : false;
    this.commitIsShowGraph(isShowGraph);
    next();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.commitIsShowGraph(false);
    });
  },
  created() {
    let routerData = this.$route.params;
    if (!routerData.length) {
      this.currentSong = this.getCurrentSongObj(session.getItem(consts.CURRENT_SONG));
    } else {
      this.currentSong = routerData.currentSong;
    }
    this.getLyric();
    this.isPlaying = this.getIsPlaying;
  },
  mounted() {
    this.height = document.querySelector('.content').clientHeight + 50;
  },
  methods: {
    ...mapActions([
      'commitIsShowGraph'
    ]),
    back() {
      this.commitIsShowGraph(true);
      this.$router.go(-1);
    },
    getCurrentSongObj(id) {
      let target = null;
      let data = apiData.lastLeftSongs;
      for (let index = 0, len = data.length; index < len; index++) {
        if (data[index].id === id) {
          target = data[index];
          break;
        }
      }
      return target;
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
    handleSignSong() {
    },
    handleCollection() {
    }
  }
};
</script>

<style lang="less" scoped>
.rotate {
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}
@keyframes rotate {
  .rotate;
}

@-moz-keyframes rotate {
  .rotate;
}

@-webkit-keyframes rotate {
  .rotate;
}

@-o-keyframes rotate {
  .rotate;
}
.stylus-img {
  position: absolute;
  top: 0;
  transform-origin: 10px 0;
  z-index: 10;
  transition: transform 400ms linear;
}
.single-song {
  position: relative;
  padding-top: 30px;
  .bg {
    width: 100%;
    background-size: cover;
    transition: all 1s ease-in-out;
    opacity: .15;
  }
  .content {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    .song-control,
    .song-detail {
      display: inline-block;
      width: 400px;
    }
    .song-control {
    .stylus {
      position: relative;
      width: 100%;
      height: 60px;
      &::before {
        content: "";
        position: absolute;
        top: -9px;
        left: 50%;
        width: 25px;
        height: 25px;
        border: 8px solid #fff;
        border-radius: 50%;
        background: rgba(222, 222, 223, 1);
        box-shadow: 0 0 2px 4px rgba(169, 169, 169, .4);
        box-sizing: border-box;
        z-index: 11;
      }
      img {
        position: absolute;
        left: 50%;
      }
    }
    .is-playing {
      img {
        .stylus-img;
        transform: rotate(40deg);
      }
    }
    .is-pause {
      img {
        .stylus-img;
        transform: rotate(0deg);
      }
    }
    .circle-panel {
      position: relative;
      width: 300px;
      height: 300px;
      margin: auto;
      border-radius: 50%;
      background: #000;
      border: 10px solid rgba(55, 54, 56, .7);
      box-shadow: 0 0 5px 1px rgba(0, 0, 0, .8) inset;
      box-sizing: border-box;
      background: url('../assets/images/songbackground.png') no-repeat center;
      background-size: cover;
      .container {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 205px;
        height: 205px;
        padding: 5px;
        border-radius: 50%;
        background: rgba(2, 2, 3, 1);
        transform: translate(-50%, -49%);
        box-sizing: border-box;
        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
    .is-rotate {
      animation: rotate 20s linear infinite;
    }
    .control {
      height: 60px;
      line-height: 60px;
      list-style: none;
      .control-item {
        display: inline-block;
        width: 60px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        margin-right: 28px;
        border-radius: 5px;
        background: rgba(38, 39, 43, .8);
        cursor: pointer;
        .white {
          color: #fff;
        }
        .fa-heart {
          color: #B82525;
        }
        &:hover {
          background: rgba(255, 255, 255, .1);
        }
        &:last-child {
          margin: 0;
        }
      }
    }
  }
  .song-detail {
    width: 280px;
    margin-left: 30px;
    text-align: left;
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
        }
        .active {
          color: #fff;
        }
      }
    }
  }
  .back {
    display: inline-block;
    position: relative;
    top: -360px;
    left: 30px;
    width: 40px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    font-size: 20px;
    background: rgba(43, 45, 48, .5);
    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, .1);
    }
  }
  }
}
</style>
