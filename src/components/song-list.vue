<template>
  <div class="song-list" @click="handleSectionClick">
    <header class="header">
      <ul class="tab" @click="handleTabSelect">
        <li :class="[classes.tabItem, !currentActive ? classes.active : '']">播放列表</li>
        <li :class="[classes.tabItem, currentActive ? classes.active : '']">历史记录</li>
      </ul>
      <span class="icon close" @click="handleClose">
        <i class="fa fa-close"></i>
      </span>
    </header>
    <ul class="content">
      <li class="operator">
        <ul>
          <li>
            <span>共{{showList.length}}首</span>
          </li>
          <li :class="{'hidden': currentActive}" class="collect">
            <span class="icon">
              <i class="fa fa-plus-square-o"></i>
            </span>
            <span @click="handleSongCollect">收藏全部</span>
          </li>
          <li class="clear">
            <span class="icon">
              <i class="fa fa-trash"></i>
            </span>
            <span @click="handleClearList">清空</span>
          </li>
        </ul>
      </li>
      <li
        class="song"
        v-for="(item, index) in getShowList"
        :key="index" 
        @contextmenu="handleContextMenu($event, item, index)">
        <span :class="[classes.status, (item.state < 0 || currentActive) ? classes.hidden : '']">
          <i :class="[item.state ? classes.play : classes.pause]"></i>
        </span>
        <span class="name">{{item.name}}</span>
        <span class="author">{{item.author}}</span>
        <span class="duration" v-show="!currentActive">{{item.duration}}</span>
        <span class="time" v-show="currentActive">{{item.time | timeFormatFilter}}</span>
      </li>
    </ul>
    <context-menu
      :contextMenu="contextMenu"
      :isShowDelete="true"
      :isShowCollect="false"
      @deleteSong="handleSongDelete">
    </context-menu>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ApiData from '@/api/data';
import session from '@/api/persist-data';
import * as consts from '@/api/consts';
import ContextMenu from '@/components/context-menu';
import MixinContextMenu from '@/mixins/mixin-contextmenu';
export default {
  name: 'song-list',
  props: ['songs'],
  components: {
    ContextMenu
  },
  mixins: [MixinContextMenu],
  data() {
    return {
      showList: [],
      playList: [],
      history: [],
      currentSong: null,
      currentIndex: 0,
      currentActive: 0,
      contextMenu: {
        currentIndex: 0,
        currentTarget: null,
        isOpenContextMenu: false,
        clientX: 0,
        clientY: 0
      },
      classes: {
        tabItem: 'tab-item',
        active: 'active',
        status: 'icon status',
        hidden: 'hidden',
        play: 'fa fa-play',
        pause: 'fa fa-pause'
      }
    };
  },
  computed: {
    ...mapGetters([
      'getCurrentSong',
      'getIsPlaying',
      'getHistorySongData'
    ]),
    getShowList() {
      this.playList = this.songs;
      this.showList = !this.currentActive ? this.playList : this.history;
      return this.showList;
    }
  },
  filters: {
    timeFormatFilter(date) {
      let now = new Date();
      let diff = date - now;
      let minute = window.parseInt(diff / (1000 * 60));
      let hour = window.parseInt(diff / (1000 * 60 * 60));
      let day = window.parseInt(diff / (1000 * 60 * 60 * 60));
      let mInfo = `${Math.abs(minute)}分钟前`;
      let hInfo = `${Math.abs(hour)}小时前`;
      let dInfo = `${Math.abs(day)}天前`;
      let justNow = '刚刚';
      let yestday = '昨天';
      return day ? (day === 1 ? yestday : dInfo) : (hour ? hInfo : (minute ? mInfo
       : justNow));
    }
  },
  watch: {
    getCurrentSong(id) {
      for (let index = 0, len = this.showList.length; index < len; index++) {
        let item = this.showList[index];
        if (item.id === id) {
          this.currentSong = item;
          this.currentIndex = index;
          this.showList.splice(index, 1, item);
          break;
        }
      }
    },
    getHistorySongData(data) {
      let set = new Set(this.history);
      data.forEach((item) => {
        let [id, time] = String(item).split('+');
        let song = this.getTargetSong(id);
        this.$set(song, 'time', new Date(Number(time)));
        set.add(song);
      });
      this.history = [...set];
    }
  },
  created() {
    let sessionData = JSON.parse(session.getItem(consts.HISTORY_SONG_DATA));
    if (sessionData && sessionData[0]) {
      this.commitHistorySongData({songs: sessionData, operator: 'add'});
    }
  },
  methods: {
    ...mapActions([
      'showSongList',
      'commitSongListData',
      'commitCurrentSong',
      'commitIsPlaying',
      'commitLoveSongList',
      'commitHistorySongData'
    ]),
    handleSongCollect() {
      let ids = [];
      this.showList.forEach((item) => {
        ids.push(item.id);
      });
      this.commitLoveSongList({id: ids, isAll: true});
    },
    getTargetSong(id) {
      return ApiData.lastLeftSongs.filter(item => item.id === id);
    },
    handleSectionClick() {
      this.contextMenu.isOpenContextMenu = false;
    },
    handleClearList() {
      if (!this.currentActive) {
        this.playList = [];
        this.commitSongListData({operator: 'clear'});
      } else {
        this.history = [];
        this.commitHistorySongData({operator: 'clear'});
      }
    },
    handleClose() {
      this.showSongList(false);
    },
    handleTabSelect(e) {
      e.stopPropagation();
      let text = e.target.innerText;
      if (String(text).indexOf('播放列表') >= 0) {
        this.currentActive = 0;
      } else {
        this.currentActive = 1;
      }
    },
    handleSongDelete() {
      let {currentTarget, currentIndex} = this.contextMenu;
      if (!this.currentActive) {
        this.commitSongListData({songs: currentTarget.id, operator: 'delete'});
        if (this.currentSong && currentTarget.id === this.currentSong.id) {
          let nextIndex = currentIndex + 1;
          nextIndex = nextIndex > this.playList.length - 1 ? 0 : nextIndex;
          let nextTarget = this.playList[nextIndex];
          if (nextTarget) {
            this.commitCurrentSong(nextTarget.id);
          }
        }
        this.playList.splice(currentIndex, 1);
        if (!this.playList.length) {
          this.commitCurrentSong();
        }
      } else {
        this.commitHistorySongData({songs: `${currentTarget.id}+${+currentTarget.time}`, operator: 'delete'});
        this.history.splice(currentIndex, 1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .song-list {
    position: absolute;
    top: -401px;
    right: 0;
    width: 500px;
    height: 400px;
    border: 1px solid rgba(11, 12, 16, 1);
    border-bottom: none;
    box-shadow: 0 0 0 1px #313337 inset;
    box-sizing: border-box;
    z-index: 9999;
    overflow: auto;
    .hidden {
      visibility: hidden;
    }
    .header {
      height: 40px;
      line-height: 40px;
      background: #282A2E;
      .tab {
        display: inline-block;
        list-style: none;
        .tab-item {
          display: inline-block;
          width: 70px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #3C3E42;
          cursor: pointer;
          &:first-child {
            margin-right: -4px;
            border-right: none;
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }
          &:last-child {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
          }
        }
        .active {
          background: #3A3A3F;
        }
      }
      .close {
        display: inline-block;
        position: absolute;
        right: 20px;
        font-size: 16px;
        cursor: pointer;
      }
    }
    .content {
      height: 359px;
      list-style: none;
      background: rgba(45, 47, 51, 1);
      .operator,
      .song {
        width: 100%;
        height: 30px;
        line-height: 30px;
        &:nth-of-type(2n) {
          background: rgba(48, 50, 54, 1);
        }
      }
      .operator {
        border-bottom: 1px solid #323438;
        ul {
          list-style: none;
          li {
            display: inline-block;
            width: 15%;
            height: 25px;
            line-height: 25px;
            text-align: center;
            &:first-child {
              width: 68%;
              text-align: left;
              text-indent: 2em;
            }
            &:nth-of-type(2) {
              text-align: right;
            }
          }
          .clear,
          .collect {
            cursor: pointer;
            &:hover {
              color: #FDFDFD;
            }
          }
        }
      }
      .song {
        text-align: left;
        cursor: pointer;
        &:hover {
          color: #FDFDFD;
          background: rgba(255, 255, 255, .03);
        }
        span {
          display: inline-block;
          overflow: hidden;
          &:first-child {
            width: 25px;
            font-size: 10px;
            text-align: center;
            color: #B82525;
          }
          &:nth-of-type(2) {
            width: 63%;
            color: #FDFDFD;
          }
          &:nth-of-type(3) {
            width: 18%;
          }
        }
      }
    }
  }
</style>
