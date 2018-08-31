<template>
  <section class="commend-musics">
    <header class="header">
      <figure class="image-container">
        <div class="info" :style="infoStyle">
          <span>{{currentWeekDay}}</span>
          <span>{{currentDate}}</span>
        </div>
      </figure>
      <div class="title">
        <h2>每日歌曲推荐</h2>
        <span class="icon">
          <i class="fa fa-lightbulb-o"></i>
          根据你的音乐口味生成，每日6:00推荐
        </span>
      </div>
    </header>
    <ul class="content">
      <li class="operator">
        <div class="add">
          <div class="play-all" @click="handlePlayAll">
            <span class="play-icon"></span>
            <span>播放全部</span>
          </div>
          <span class="icon" @click="handleAddAll">
            <i class="fa fa-plus"></i>
          </span>
        </div>
        <span class="icon" @click="handleCollectAll">
          <i class="fa fa-plus-square-o"></i>
          收藏全部
        </span>
      </li>
      <li class="item" v-for="(item, index) in songs" :key="index"
        @contextmenu="handleContextMenu($event, item, index)">
        <span>{{index + 1 | indexFilter}}</span>
        <span class="icon" @click="handleSongLoveSelect(item)">
          <i :class="[item.isLove ? classes.redHeart : classes.heart]"></i>
        </span>
        <span>{{item.name}}</span>
        <span>{{item.author}}</span>
        <span>{{item.album}}</span>
        <span>{{item.duration}}</span>
      </li>
    </ul>
    <collect-message :message="message"></collect-message>
    <context-menu
    :contextMenu="contextMenu"
    :isShowDelete="false"
    :isShowCollect="true"
    @collectSong="handleCollectSong"
    ></context-menu>
  </section>
</template>

<script>
import session from '@/api/persist-data';
import * as consts from '@/api/consts';
import ApiData from '@/api/data';
import { mapActions, mapGetters } from 'vuex';
import ContextMenu from '@/components/context-menu';
import MixinContextMenu from '@/mixins/mixin-contextmenu';
import MixinCollectMsg from '@/mixins/mixin-collectmsg';
export default {
  name: 'commend-musics',
  components: {
    ContextMenu
  },
  mixins: [MixinContextMenu, MixinCollectMsg],
  data() {
    return {
      currentWeekDay: null,
      currentDate: null,
      songs: ApiData.lastLeftSongs,
      classes: {
        heart: 'fa fa-heart-o',
        redHeart: 'fa fa-heart'
      }
    };
  },
  computed: {
    infoStyle() {
      let theme = this.$parent.$data.theme;
      let dateColor = theme.content.date;
      return {color: `${dateColor}`};
    },
    ...mapGetters([
      'getLoveSongList',
      'getSongListData'
    ])
  },
  filters: {
    indexFilter(val) {
      return val < 10 ? '0' + val : val;
    }
  },
  created() {
    let params = this.$route.params;
    let currentTimes = String(session.getItem(consts.CURRENT_TIME)).split('-');
    let target = Array.isArray(params) && params.length ? params : {date: currentTimes[0], weekDay: currentTimes[1]};
    this.currentDate = target.date;
    this.currentWeekDay = target.weekDay;
    let songIds = [...this.getLoveSongList];
    if (!songIds.length) {
      let songs = JSON.parse(session.getItem(consts.LOVE_SONGS));
      this.commitLoveSongList({id: songs, isAll: true});
      songIds = songs;
    }
    this.songs.forEach((item) => {
      let isLove = false;
      if (songIds && songIds.includes(item.id)) {
        isLove = true;
      }
      this.isPlaying = false;
      this.$set(item, 'isLove', isLove);
    });
  },
  methods: {
    ...mapActions([
      'commitLoveSongList',
      'commitSongListData',
      'commitCurrentSong',
      'commitIsChangeAudio'
    ]),
    handleCollectSong() {
      this.contextMenu.isOpenContextMenu = false;
      this.handleSongLoveSelect(this.contextMenu.currentTarget, true);
    },
    handleAddAll() {
      let ids = [];
      this.songs.forEach((item) => {
        ids.push(item.id);
      });
      this.commitIsChangeAudio(false);
      this.commitCurrentSong(this.songs[0].id);
      this.commitSongListData({songs: ids, operator: 'add'});
    },
    handlePlayAll() {
      this.handleAddAll();
    },
    handleSongLoveSelect(item, isOnlyCollect) {
      let operator = isOnlyCollect ? (item.isLove ? 'reAdd' : 'add') : item.isLove ? 'delete' : 'add';
      if (isOnlyCollect) {
        this.$set(item, 'isLove', true);
      } else {
        this.$set(item, 'isLove', !item.isLove);
        this.commitLoveSongList({id: item.id, operator: operator});
      }
      this.message.isShow = true;
      this.message.status = operator;
    },
    handleCollectAll() {
      let ids = [];
      this.songs.forEach((item) => {
        ids.push(item.id);
        this.$set(item, 'isLove', true);
      });
      this.commitLoveSongList({id: ids, isAll: true});
    }
  }
};
</script>

<style lang="less" scoped>
.commend-musics {
  padding: 0 30px;
  text-align: left;
  .header {
    width: 100%;
    height: 100px;
    .image-container {
      display: inline-block;
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0;
      text-align: center;
      .info {
        width: 100%;
        height: 100%;
        background: #fff;
        overflow: hidden;
        span {
          display: block;
          &:first-child {
            color: #828385;
            height: 30%;
            padding-top: 12%;
            font-size: 16px;
            box-sizing: border-box;
          }
          &:last-child {
            height: 70%;
            line-height: 110%;
            font-size: 58px;
          }
        }
      }
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .title {
      display: inline-block;
      width: 300px;
      height: 100%;
      text-indent: 1.5em;
      overflow: hidden;
      h2 {
        color: #fff;
      }
    }
  }
  .content {
    @borderColor: #B82525;
    margin-top: 10px;
    border: 1px solid rgba(32, 32, 38, 1);
    list-style: none;
    .border {
      border: 1px solid @borderColor;
    }
    .inline-block {
      display: inline-block;
    }
    .background {
      background: #25272B;
    }
    .hoverBackground {
      background: rgba(255, 255, 255, .1);
    }
    .operator {
      display: table;
      position: relative;
      width: 100%;
      height: 40px;
      line-height: 40px;
      .add {
        display: table-cell;
        margin-left: 1em;
        cursor: pointer;
        .inline-block;
        height: 25px;
        line-height: 25px;
        .border;
        border-radius: 5px;
        vertical-align: middle;
        .icon {
          .inline-block;
          &:last-child {
            .background;
            width: 20px;
            color: @borderColor;
            font-size: 10px;
            margin-left: -3px;
            text-align: center;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            overflow: hidden;
          }
          &:hover {
            .hoverBackground;
          }
        }
        .play-all {
          position: relative;
          .inline-block;
          padding: 0 10px;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
          overflow: hidden;
          &:hover {
            .hoverBackground;
          }
          .background;
          .play-icon {
            position: absolute;
            top: 50%;
            .inline-block;
            width: 14px;
            height: 14px;
            text-align: center;
            transform: translateY(-50%);
            .border;
            border-radius: 50%;
            &::after {
              position: absolute;
              top: 50%;
              left: 50%;
              content: "";
              width: 0;
              height: 0;
              border-top: 3px solid transparent;
              border-bottom: 3px solid transparent;
              border-left: 6px solid @borderColor;
              transform: translate(-50%, -50%);
            }
          }
          span:last-child {
            .inline-block;
            padding-left: 20px;
            color: @borderColor;
          }
        }
      }
      > .icon {
        position: absolute;
        top: 50%;
        right: 20px;
        height: 30px;
        line-height: 30px;
        margin-top: -15px;
        padding: 0 10px;
        border-radius: 5px;
        background: #25272B;
        cursor: pointer;
        &:hover {
          .hoverBackground;
        }
      }
    }
    .item {
      height: 30px;
      line-height: 30px;
      color: #45464A;
      &:nth-of-type(2n) {
        background: rgba(26, 28, 32, 1);
      }
      span {
        display: inline-block;
        padding-right: 10px;
        box-sizing: border-box;
        &:first-child {
          text-indent: 1em;
        }
        &:nth-of-type(2) {
          cursor: pointer;
          .fa-heart {
            color: #B82525;
          }
        }
        &:nth-of-type(3) {
          width: 37%;
          padding-left: 20px;
          color: #fff;
        }
        &:nth-of-type(4) {
          width: 20%;
        }
        &:nth-of-type(5) {
          width: 25%;
        }
        &:last-child {
          width: 50px;
          padding-left: 15px;
        }
      }
      &:hover,
      .is-select {
        color: #fff;
        background: rgba(124, 124, 124, .1);
      }
    }
  }
}
</style>
