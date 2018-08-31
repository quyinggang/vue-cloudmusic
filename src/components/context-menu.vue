<template>
  <div class="context-menu">
    <message
      :isShowHeader="false"
      :isShowMessage="menu.isOpenContextMenu"
      :positionX="menu.clientX"
      :positionY="menu.clientY">
      <ul class="content">
        <li @click="handleSongPlay">
          <span class="icon"></span>
          播放
        </li>
        <li @click="handleSongDelete" v-show="isShowDelete">
          <span class="icon">
            <i class="fa fa-trash-o"></i>
          </span>
          从列表中删除
        </li>
        <li @click="handleCollectSong" v-show="isShowCollect">
          <span class="icon">
            <i class="fa fa-plus-square-o"></i>
          </span>
          收藏
        </li>
      </ul>
    </message>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: ['contextMenu', 'isShowCollect', 'isShowDelete'],
  data() {
    return {
      menu: null
    };
  },
  computed: {
    copy() {
      return this.contextMenu;
    }
  },
  created() {
    this.menu = this.copy;
  },
  mounted() {
    document.addEventListener('click', this.hiddenContextMenu);
  },
  methods: {
    ...mapActions([
      'commitIsPlaying',
      'commitCurrentSong',
      'commitSongListData',
      'commitIsChangeAudio'
    ]),
    hiddenContextMenu() {
      this.menu.isOpenContextMenu = false;
    },
    handleSongPlay() {
      let {currentTarget} = this.menu;
      this.commitSongListData({songs: currentTarget.id, operator: 'add'});
      this.commitCurrentSong(currentTarget.id);
      this.commitIsPlaying(true);
      this.commitIsChangeAudio(false);
    },
    handleSongDelete() {
      this.$emit('deleteSong');
    },
    handleCollectSong() {
      this.$emit('collectSong');
    }
  }
};
</script>

<style lang="less" scoped>
  .context-menu {
    position: absolute;
    .content {
      list-style: none;
      li {
        width: 150px;
        height: 30px;
        line-height: 30px;
        text-align: left;
        cursor: default;
        .icon {
          display: inline-block;
          width: 18px;
          height: 18px;
          line-height: 18px;
          font-size: 16px;
          text-align: center;
          margin: 0 5px;
        }
        &:hover {
          background: rgba(124, 124, 124, .1);
        }
        &:first-child {
          .icon {
            display: inline-block;
            position: relative;
            top: 50%;
            font-size: 10px;
            border: 1px solid rgba(174, 174, 178, .5);
            border-radius: 50%;
            transform: translateY(-60%);
            box-sizing: border-box;
            &::before {
              content: "";
              position: absolute;
              top: 50%;
              left: 50%;
              border-top: 5px solid transparent;
              border-bottom: 5px solid transparent;
              border-left: 5px solid #fff;
              transform: translate(-50%, -50%);
            }
          }
        }
      }
    }
  }
</style>