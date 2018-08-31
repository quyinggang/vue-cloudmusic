<template>
  <div class="fmusic">
      <vue-carousel></vue-carousel>
      <section class="songs-list">
        <h3 :style="borderBottomStyle">推荐歌单</h3>
        <ul class="content">
          <li class="song-item" v-for="(item, index) in sls" :key="index">
            <figure>
              <div class="info" v-show="!index" :style="infoStyle" 
                @mouseover="handleShowPlay(item, true)"
                @mouseout="handleShowPlay(item)"
                @click="jumpToCommendMusics">
                <span class="week">{{getCurrentWeekDay}}</span>
                <span class="date">{{getCurrentDate}}</span>
              </div>
              <transition name="slide-fade">
                <p class="instruction" v-show="item.isShowNote"  
                @mouseover="handleShowPlay(item, true)">{{item.note}}</p>
              </transition>
              <span v-if="index && item.isShowPlay" class="icon"
               @mouseover="handleShowPlay(item, true)"><i class="fa fa-play"></i></span>
              <img :class="{'recommend': !index}" :src="item.imgUrl" alt="image" 
                @mouseover="handleShowPlay(item, true)"
                @mouseout="handleShowPlay(item)">
              <p :title="item.title">{{item.title | titleFilter}}</p>
            </figure>
          </li>
        </ul>
      </section>
      <section class="mvs">
        <h3 :style="borderBottomStyle">推荐mv</h3>
        <ul class="content">
          <li class="mv-item" v-for="(item, index) in mvs" :key="index">
            <figure @click="jumpToMV(item)">
              <transition name="slide-fade">
                <p class="instruction" v-show="item.isShowNote"  
                @mouseover="handleShowPlay(item, true)">{{item.note}}</p>
              </transition>
              <img :src="item.imgUrl" alt="image"
               @mouseover="handleShowPlay(item, true)"
               @mouseout="handleShowPlay(item)">
              <p>
                <span @click="jumpToMV(item)">{{item.name}}</span>
                <span>{{item.author}}</span>
              </p>
            </figure>
          </li>
        </ul>
      </section>
      <section class="last-musics">
        <h3 :style="borderBottomStyle">最新音乐</h3>
        <ul class="content">
          <li class="left" :style="borderStyle">
            <ul :class="[isThemeOfOther ? classes.isOther : classes.isDefault]">
              <li :class="{'active': item.isActive}"
                v-for="(item, index) in lastLeftSongs" :key="index" 
                @click="handleMusicSelect(item)">
                <label class="index">{{index + 1 | indexPadFilter}}</label>
                <div class="icon">
                  <span><i class="fa fa-play"></i></span>
                  <img :src="item.imgUrl" alt="image">
                </div>
                <div class="song-infoes">
                  <span>{{item.name}}</span>
                  <span>{{item.author}}</span>
                </div>
              </li>
            </ul>
          </li>
          <li class="right" :style="borderStyle">
            <ul :class="[isThemeOfOther ? classes.isOther : classes.isDefault]">
              <li :class="{'active': item.isActive}" v-for="(item, index) in lastRightSongs" :key="index" @click="handleMusicSelect(item)">
                <label class="index">{{index + 6 | indexPadFilter}}</label>
                <div class="icon">
                  <span><i class="fa fa-play"></i></span>
                  <img :src="item.imgUrl" alt="image">
                </div>
                <div class="song-infoes">
                  <span>{{item.name}}</span>
                  <span>{{item.author}}</span>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </section>
  </div>
</template>

<script>
import VueCarousel from '@/components/vue-carousel';
import ApiData from '@/api/data';
import session from '@/api/persist-data';
import * as consts from '@/api/consts';
import {mapGetters, mapActions} from 'vuex';
export default {
  name: 'fmusic',
  components: {
    VueCarousel
  },
  data() {
    return {
      isThemeOfOther: false,
      sls: ApiData.sls,
      mvs: ApiData.mvs,
      lastLeftSongs: ApiData.lastLeftSongs,
      lastRightSongs: ApiData.lastRightSongs,
      timer: null,
      overTimer: null,
      currentHeight: 0,
      weeks: ['日', '一', '二', '三', '四', '五', '六'],
      classes: {
        active: 'active',
        isDefault: 'is-default-theme',
        isOther: 'is-other-theme'
      }
    };
  },
  computed: {
    ...mapGetters([
      'getCurrentSkin'
    ]),
    borderBottomStyle() {
      let theme = this.$parent.$data.theme;
      let color = theme.audio === 'transparent' ? '#23262C' : '#E1E1E2';
      if (theme.audio !== 'transparent') {
        this.isThemeOfOther = true;
      }
      return {borderBottom: `1px solid ${color}`};
    },
    borderStyle() {
      let color = !this.isThemeOfOther ? '#1F2024' : '#EDEDED';
      return {border: `1px solid ${color}`};
    },
    infoStyle() {
      let height = this.currentHeight;
      let theme = this.$parent.$data.theme;
      let dateColor = theme.content.date;
      if (!dateColor) {
        dateColor = theme.audio;
      }
      return {height: `${height}px`, color: `${dateColor}`};
    },
    getCurrentDate() {
      return new Date().getDate();
    },
    getCurrentWeekDay() {
      let weekDay = new Date().getDay();
      return '星期' + this.weeks[weekDay];
    }
  },
  filters: {
    titleFilter(val) {
      return (String(val).length > 8 ? String(val).substr(0, 8) + '...' : val);
    },
    indexPadFilter(val) {
      return String(val).length < 2 ? '0' + val : val;
    }
  },
  watch: {
    getCurrentSkin(skin) {
      this.isThemeOfOther = skin === 'black' ? false : Boolean(true);
    }
  },
  mounted() {
    let that = this;
    that.currentHeight = document.querySelector('.recommend').offsetHeight;
    window.addEventListener('resize', function(e) {
      clearTimeout(that.timer);
      that.timer = window.setTimeout(() => {
        let rNode = document.querySelector('.recommend');
        if (rNode) {
          that.currentHeight = rNode.offsetHeight <= 50 ? 100 : rNode.offsetHeight;
        }
      }, 30);
    });
  },
  methods: {
    ...mapActions([
      'commitSongListData',
      'commitCurrentSong',
      'commitIsPlaying',
      'commitIsChangeAudio'
    ]),
    jumpToCommendMusics() {
      let weekDay = this.getCurrentWeekDay;
      let date = this.getCurrentDate;
      this.$router.push({name: 'commendMusics', params: {weekDay: weekDay, date: date}});
      session.setItem(consts.CURRENT_TIME, `${date}-${weekDay}`);
    },
    jumpToMV(data) {
      this.$router.push({name: 'mv', params: {mv: data.id}});
      session.setItem(consts.CURRENT_MV, data.id);
    },
    clearActive() {
      this.lastLeftSongs.forEach((item) => {
        this.$set(item, 'isActive', false);
      });
      this.lastRightSongs.forEach((item) => {
        this.$set(item, 'isActive', false);
      });
    },
    handleMusicSelect(item) {
      this.clearActive();
      this.$set(item, 'isActive', true);
      this.commitSongListData({songs: item.id, operator: 'add'});
      this.commitCurrentSong(item.id);
      this.commitIsPlaying(true);
      this.commitIsChangeAudio(false);
    },
    handleShowPlay(item, isShow) {
      this.$set(item, 'isShowPlay', !!isShow);
      clearTimeout(this.overTimer);
      if (!isShow) {
        this.$set(item, 'isShowNote', !!isShow);
      } else {
        this.overTimer = window.setTimeout(() => {
          this.$set(item, 'isShowNote', !!isShow);
        }, 1000);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@keyframes slideFadeIn {
  from {
    transform: translate3d(0, -20%, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes slideFadeOut {
  from {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  to {
    transform: translate3d(0, -20%, 0);
    opacity: 0;
  }
}
.slide-fade-enter-active {
  -webkit-animation: slideFadeIn .3s;
  -moz-animation: slideFadeIn .3s;
  -ms-animation: slideFadeIn .3s;
  -o-animation: slideFadeIn .3s;
  animation: slideFadeIn .3s;
}
.slide-fade-leave-active {
  -webkit-animation: slideFadeOut .3s;
  -moz-animation: slideFadeOut .3s;
  -ms-animation: slideFadeOut .3s;
  -o-animation: slideFadeOut .3s;
  animation: slideFadeOut .3s;
}
.fmusic {
  padding: 0 100px;
  h3 {
    text-align: left;
    height: 25px;
  }
  .content {
    list-style: none;
  }
  .note {
    position: absolute;
    top: -14px;
    width: 100%;
    line-height: 20px;
    padding: 2px 10px;
    text-align: left;
    box-sizing: border-box;
    white-space: normal;
    background: rgba(38, 40, 44, .5);
    z-index: 2;
  }
  .songs-list {
    .content {
      list-style: none;
      .song-item {
        display: inline-block;
        width: 18%;
        height: 100%;
        margin-right: 2.5%;
        figure {
          position: relative;
          width: 100%;
          height: 100%;
          margin: 0;
          p {
            text-align: left;
            white-space: nowrap;
            cursor: pointer;
          }
          .info {
            position: absolute;
            top: 0;
            width: 100%;
            height: 300px;
            cursor: pointer;
            .week,
            .date {
              display: block;
              font-size: 18px;
            }
            .week {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -220%);
              color: #828385;
            }
            .date {
              position: absolute;
              top: 50%;
              left: 50%;
              font-size: 80px;
              transform: translate(-50%, -30%);
            }
          }
        }
        .instruction {
          .note
        }
        .icon {
          display: block;
          position: absolute;
          right: 10px;
          bottom: 50px;
          width: 25px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          border: 1px solid #DFDFDF;
          border-radius: 50%;
          box-sizing: border-box;
          background: rgba(38, 40, 44, .5);
        }
        img {
          display: block;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        &:last-child {
          margin: 0;
        }
        &:first-child {
          img {
            border: 1px solid #E5E5E5;
            box-sizing: border-box;
          }
        }
      }
    }
  }
  .mvs {
    .mv-item {
      display: inline-block;
      width: 24%;
      height: 100%;
      margin-right: 1.3%;
      &:last-child {
        margin-right: 0;
      }
      figure {
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0;
        img {
          display: block;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        p {
          text-align: left;
          span {
            display: block;
            line-height: 20px;
            &:first-child {
              cursor: pointer;
            }
            &:last-child {
              font-size: 12px;
              color: #828385;
            }
          }
        }
         .instruction {
          .note
        }
      }
    }
  }
  .last-musics {
    .content {
      .left, 
      .right {
        display: inline-block;
        width: 50%;
        height: 301px;
        box-sizing: border-box;
        li {
          position: relative;
          height: 60px;
          line-height: 60px;
          text-align: left;
          list-style: none;
          cursor: pointer;
          .index,
          .icon,
          .song-infoes {
            display: block;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }
          .index {
            left: 0;
            width: 30px;
            text-align: center;
          }
          .icon,
          .song-infoes {
            left: 30px;
            width: 40px;
            height: 40px;
          }
          .icon {
            span {
              display: block;
              position: absolute;
              top: 50%;
              left: 50%;
              width: 25px;
              height: 25px;
              line-height: 25px;
              color: #fff;
              font-size: 12px;
              text-align: center;
              transform: translate(-50%, -50%);
              border: 1px solid #DFDFDF;
              border-radius: 50%;
              box-sizing: border-box;
              z-index: 10;
              background: rgba(38, 40, 44, .3);
              &:hover {
                background: rgba(38, 40, 44, .7);
              }
            }
            img {
              diplay: block;
              width: 100%;
              height: 100%;
            }
          }
          .song-infoes {
            left: 75px;
            width: 100px;
            span {
              display: block;
              &:first-child {
                height: 24px;
                line-height: 24px;
              }
              &:last-child {
                color: #5F5F63;
                height: 16px;
                line-height: 16px;
              }
            }
          }
        }
        .is-default-theme {
          li {
            &:nth-of-type(2n) {
              background: rgba(38, 40, 44, .2);
            }
            &:hover {
              background: rgba(38, 40, 44, .5);
            }
          }
          .active {
            background: rgba(38, 40, 44, .6) !important;
          }
        }
        .is-other-theme {
          li {
            &:nth-of-type(2n) {
              background: rgba(245, 245, 247, 1);
            }
            &:hover {
              background: rgba(235, 236, 237, 1);
            }
          }
          .active {
            background: rgba(237, 237, 239, 1) !important;
          }
        }
      }
      .left {
        margin-right: -4px;
        border-right: none !important;
      }
    }
  }
}
</style>


