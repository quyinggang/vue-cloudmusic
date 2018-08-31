<template>
  <section class="love-songs">
    <header class="header">
      <figure class="image-container">
        <span class="icon">
          <i class="fa fa-heart-o"></i>
        </span>
        <img src="../assets/images/myLoves.jpg" alt="image">
      </figure>
      <div class="title">
        <span class="sign">歌单</span>
        <h2>我喜欢的音乐</h2>
        <span class="number">歌曲数：{{songs.length}}</span>
        <div class="operator">
          <div class="add">
            <div class="play-all">
              <span class="play-icon"></span>
              <span>播放全部</span>
            </div>
            <span class="icon">
              <i class="fa fa-plus"></i>
            </span>
          </div>
        </div>
      </div>
    </header>
    <div class="content">
      <ul class="tab">
        <li class="item">歌曲列表</li>
        <li class="item"><input type="text" placeholder="搜索歌单音乐"></li>
      </ul>
      <table class="tab-item" width="100%" cellpadding="7" cellspacing="0">
        <thead>
          <th></th>
          <th>操作</th>
          <th>音乐标题</th>
          <th>歌手</th>
          <th>专辑</th>
          <th>时长</th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in songs" :key="index" @contextmenu="handleContextMenu($event, item, index)">
            <td>{{index + 1 | indexFilter}}</td>
            <td>
              <span class="icon" @click="handleLoveSongCancel(item)">
                <i class="fa fa-heart"></i>
              </span>
            </td>
            <td>{{item.name}}</td>
            <td>{{item.author}}</td>
            <td>{{item.album}}</td>
            <td>{{item.duration}}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
    <message title="取消喜欢" :isShowFooter="true" 
      :isShowMessage="isShowMessage"
      @close="handleClose">
      <p class="p">确认将选中歌曲从我喜欢的音乐中删除?</p>
    </message>
    <context-menu 
    :contextMenu="contextMenu"
    :isShowDelete="true"
    :isShowCollect="false"
    @deleteSong="handleSongDelete">
    </context-menu>
  </section>
</template>

<script>
import session from '@/api/persist-data';
import * as consts from '@/api/consts';
import { mapGetters, mapActions } from 'vuex';
import ApiData from '@/api/data';
import ContextMenu from '@/components/context-menu';
import MixinContextMenu from '@/mixins/mixin-contextmenu';
export default {
  name: 'commend-musics',
  components: {
    ContextMenu
  },
  mixins: [MixinContextMenu],
  data() {
    return {
      currentWeekDay: null,
      currentDate: null,
      songs: [],
      hash: {},
      selectedSong: null,
      isShowMessage: false
    };
  },
  computed: {
    infoStyle() {
      let theme = this.$parent.$data.theme;
      let dateColor = theme.content.date;
      return {color: `${dateColor}`};
    },
    ...mapGetters([
      'getLoveSongList'
    ])
  },
  filters: {
    indexFilter(val) {
      return String(val).length === 1 ? '0' + val : val;
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
    if (songIds) {
      this.getTargetSong(songIds);
    }
  },
  methods: {
    ...mapActions([
      'commitLoveSongList'
    ]),
    getTargetSong(songIds) {
      ApiData.lastLeftSongs.forEach((item, index) => {
        if (songIds.includes(item.id)) {
          this.songs.push(item);
          this.hash[item.id] = this.songs.length - 1;
        }
      });
    },
    handleClose(isConfirm) {
      this.isShowMessage = false;
      if (isConfirm) {
        let item = this.selectedSong;
        this.songs.splice(this.hash[item.id], 1);
        this.commitLoveSongList({id: item.id, operator: 'delete'});
      }
    },
    handleLoveSongCancel(item) {
      this.isShowMessage = true;
      this.selectedSong = item;
    },
    handleSongDelete() {
      let {currentTarget, currentIndex} = this.contextMenu;
      this.commitLoveSongList({id: currentTarget.id, operator: 'delete'});
      this.songs.splice(currentIndex, 1);
    }
  }
};
</script>

<style lang="less" scoped>
.padding30 {
   padding: 0 30px;
   box-sizing: border-box;
}
.love-songs {
  text-align: left;
  .header {
    .padding30;
    .image-container {
      float: left;
      position: relative;
      width: 200px;
      height: 200px;
      margin: 0;
      margin-right: 3em;
      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        color: #fff;
        font-size: 100px;
        transform: translate(-50%, -50%);
      }
      img {
        display: block;
        width: 100%;
        height: 100%;
        opacity: .2;
      }
    }
    .title {
      @borderColor: #B82525;
      width: 300px;
      height: 200px;
      overflow: hidden;
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
      h2 {
        display: inline-block;
        font-size: 22px;
      }
      .sign {
        display: inline-block;
        width: 35px;
        height: 22px;
        line-height: 22px;
        color: rgba(224, 63, 64, 1);
        text-align: center;
        border: 1px solid rgba(224, 63, 64, 1);
      }
      .number {
        display: block;
        height: 30px;
        line-height: 30px;
      }
      .operator {
        position: relative;
        height: 30px;
        line-height: 30px;
        .add {
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
    }
  }
  .content {
    margin-top: 50px;
    .tab,
    .tab-item {
      list-style: none;
    }
    .tab {
      position: relative;
      width: 100%;
     .padding30;
      border-bottom: 1px solid #B82525;
      .item {
        display: inline-block;
        text-align: center;
        &:first-child {
          width: 80px;
          height: 30px;
          line-height: 30px;
          color: #fff;
          background: #B82525;
        }
        &:last-child {
          position: absolute;
          right: 40px;
          bottom: 5px;
          input {
            text-indent: 1em;
            border: none;
            border-radius: 10px;
            background: rgba(32, 34, 38, 1);
            outline: none;
          }
        }
      }
    }
    .tab-item {
      @borderColor: rgba(225, 225, 226, .1);
      th {
        border-right: 1px solid @borderColor;
        border-bottom: 1px solid @borderColor;
        &:first-child {
          width: 40px;
        }
        &:nth-of-type(2) {
          width: 50px;
        }
        &:last-child {
          border-right: 0;
        }
      }
      tr {
        color: #45464A;
        &:nth-of-type(2n) {
          background: rgba(26, 28, 32, 1);
        }
        &:hover {
          color: #fff;
          background: rgba(124, 124, 124, .1);
        }
        td {
          &:first-child {
            text-align: right;
          }
          &:nth-of-type(2) {
            padding-left: 10px;
            color: #B82525;
            cursor: pointer;
          }
          &:nth-of-type(3) {
            color: #fff;
          }
        }
      }
    }
  }
  .p {
    margin: 0;
    padding: 50px 20px; 
  }
}
</style>
