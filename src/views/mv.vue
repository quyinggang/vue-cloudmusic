<template>
  <section class="mv-show">
    <div :class="[classes.mv, isFullScreen ? classes.fullScreen : '']" @mousemove="handleSlideFade">
     <ul :class="headerClass">
       <li class="item" v-show="!isFullScreen">
        <span class="icon">
          <i class="fa fa-angle-left"></i>
        </span>
       </li>
       <li class="item">
         <span class="type" v-show="!isFullScreen">MV</span>
         <span class="name">{{currentMV.name}}</span>
         <span class="author">{{currentMV.author}}</span>
       </li>
     </ul>
     <vue-video :src="currentMV.src" @fullScreen="handleFullScreen"></vue-video>
    </div>
    <div class="mv-infoes">
      <span>MV介绍</span>
      <div class="content">
        <span>发布时间：{{currentMV.published}}</span>
        <span>播放次数：{{currentMV.counts}}</span>
      </div>
    </div>
  </section>
</template>

<script>
import ApiData from '@/api/data';
import * as consts from '@/api/consts';
import session from '@/api/persist-data';
import VueVideo from '@/components/vue-video';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'mv',
  components: {
    VueVideo
  },
  data() {
    return {
      currentMV: null,
      isFullScreen: false,
      isSlideFade: false,
      timer: null,
      classes: {
        mv: 'mv',
        header: 'header',
        fullScreen: 'full-screen',
        absolute: 'is-absolute',
        slideFadeOut: 'slide-fade-out',
        slideFadeIn: 'slide-fade-in'
      }
    };
  },
  computed: {
    ...mapGetters([
      'getCurrentSong'
    ]),
    headerClass() {
      let classes = this.classes;
      return [classes.header, this.isFullScreen ? (this.isSlideFade ? classes.slideFadeOut : classes.slideFadeIn) : ''];
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.handleSongStop();
    });
  },
  beforeRouteLeave(to, from, next) {
    this.commitCurrentSong(session.getItem(consts.HISTORY_CURRENT_SONG));
    next();
  },
  created() {
    let params = this.$route.params;
    let sessionData = session.getItem(consts.CURRENT_MV);
    let id = Object.keys(params).length ? params.mv : sessionData;
    this.currentMV = this.getTargetMV(id);
    if (!session.getItem(consts.HISTORY_CURRENT_SONG)) {
      session.setItem(consts.HISTORY_CURRENT_SONG, this.getCurrentSong);
    }
    this.commitCurrentSong();
    this.commitIsPlaying(false);
  },
  methods: {
    ...mapActions([
      'commitIsPlaying',
      'commitCurrentSong'
    ]),
    getTargetMV(id) {
      let target = null;
      let data = ApiData.mvs;
      for (let index = 0, len = data.length; index < len; index++) {
        let item = data[index];
        if (item.id === id) {
          target = item;
          break;
        }
      }
      return target;
    },
    handleSongStop() {
      this.commitIsPlaying(false);
    },
    handleFullScreen(isFull) {
      this.isFullScreen = isFull;
      if (this.isFullScreen) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.isSlideFade = true;
        }, 3000);
      }
    },
    handleSlideFade() {
      if (!this.isFullScreen) {
        return;
      }
      this.isSlideFade = false;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isSlideFade = true;
      }, 3000);
    }
  }
};
</script>

<style lang="less" scoped>
.inline-block {
  display: inline-block;
}

.slide-fade-in {
  transform: translateY(0);
  transition: transform 300ms linear;
}
.slide-fade-out {
  transform: translateY(-100%);
  transition: transform 300ms linear;
}
.mv-show {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
  .mv {
    .inline-block;
    width: 690px;
    height: 470px;
    .header {
      height: 40px;
      line-height: 40px;
      text-align: left;
      font-size: 20px;
      list-style: none;
      .item {
        .inline-block;
        cursor: pointer;
        .type {
          .inline-block;
          width: 30px;
          height: 22px;
          line-height: 22px;
          margin: 0 5px;
          text-align: center;
          font-size: 13px;
          color: rgba(224, 63, 64, 1);
          border: 1px solid rgba(224, 63, 64, 1);
          box-sizing: border-box;
          background: transparent;
        }
        .name {
          color: #fff;
        }
        .author {
          font-size: 14px;
          color: rgba(130, 131, 133, 1);
        }
      }
    }
  }
  .mv-infoes {
    .inline-block;
    position: relative;
    bottom: 470px;
    width: 300px;
    padding-left: 20px;
    text-align: left;
    > span {
      display: inline-block;
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      border-bottom: 1px solid rgba(35, 38, 44, 1);
    }
    .content {
      padding-top: 10px;
      color: rgba(95, 95, 99, 1);
      > span:last-child {
        display: inline-block;
        width: 50%;
        text-align: right;
      }
    }
  }
  .full-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 700px;
    z-index: 10;
    overflow: hidden;
    .header {
      position: absolute;
      width: 100%;
      padding-left: 10px;
      background: rgba(17, 17, 17, 1);
      z-index: 11;
    }
  }
}
</style>