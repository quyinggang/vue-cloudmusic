<template>
  <section
    class="song-graph"
    @mouseover="handleMouseOver"
    @mouseout="handleMouseOut"
    :style="graphStyle">
    <div class="graph" @click="handleIconClick">
      <img :src="currentSong && currentSong.imgUrl">
      <span class="icon" v-show="isShowExpand">
        <i class="fa fa-expand"></i>
      </span>
    </div>
    <div class="song-infoes">
      <span class="name">{{currentSong && currentSong.name}}</span>
      <span class="author">{{currentSong && currentSong.author}}</span>
    </div>
    <div class="operator">
      <span class="icon" @click="handleSongCollect">
        <i :class="[currentSong && currentSong.isLove ? classes.redHeart : classes.heart]"></i>
      </span>
    </div>
    <collect-message :message="message"></collect-message>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MixinCollectMsg from '@/mixins/mixin-collectmsg';
import MixinTheme from '@/mixins/mixin-theme';
export default {
  name: 'song-graph',
  props: ['currentSong'],
  mixins: [MixinCollectMsg, MixinTheme],
  data() {
    return {
      theme: null,
      isShowGraph: false,
      isShowExpand: false,
      classes: {
        heart: 'fa fa-heart-o',
        redHeart: 'fa fa-heart'
      }
    };
  },
  computed: {
    ...mapGetters([
      'getLoveSongList'
    ]),
    getLoveSongListLen() {
      return [...this.getLoveSongList].length;
    },
    getCurrentSongId() {
      return this.currentSong ? this.currentSong.id : 0;
    },
    graphStyle() {
      let bg = 'rgba(25, 27, 31, 1)';
      let borderColor = 'rgba(35, 38, 44, 1)';
      let color = 'rgba(220, 221, 228, 1)';
      if (this.theme.audio !== 'transparent') {
        bg = '#F5F5F7';
        borderColor = '#E1E1E2';
        color = 'rgba(51, 51, 51, .8)';
      }
      return {background: bg, borderTop: `1px solid ${borderColor}`, color: color};
    }
  },
  watch: {
    getLoveSongListLen() {
      this.setSongIsLove();
    },
    getCurrentSongId() {
      this.setSongIsLove();
    }
  },
  created() {
    this.setSongIsLove();
  },
  methods: {
    ...mapActions([
      'commitIsShowGraph',
      'commitLoveSongList'
    ]),
    setSongIsLove() {
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
    handleMouseOver() {
      this.isShowExpand = true;
    },
    handleMouseOut() {
      this.isShowExpand = false;
    },
    handleIconClick() {
      let song = JSON.stringify(this.currentSong);
      this.commitIsShowGraph(false);
      this.$router.push({name: 'song', params: {currentSong: song}});
    },
    handleSongCollect() {
      if (this.currentSong) {
        let isLove = this.currentSong.isLove;
        let operator = isLove ? 'delete' : 'add';
        this.$set(this.currentSong, 'isLove', !isLove);
        this.commitLoveSongList({id: this.currentSong.id, operator: operator});
        this.message.isShow = true;
        this.message.status = operator;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.absolute {
  position: absolute;
}
.song-graph {
  .absolute;
  bottom: 50px;
  width: 199px;
  height: 58px;
  line-height: 58px;
  .graph,
  .song-infoes,
  .operator {
    display: inline-block;
  }
  .graph {
    .absolute;
    top: 50%;
    left: 8px;
    width: 50px;
    height: 50px;
    margin-top: -25px;
    cursor: pointer;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .icon {
      display: block;
      .absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: #fff;
      font-size: 35px;
      background: rgba(8, 9, 13, .4);
    }
  }
  .song-infoes {
    .absolute;
    top: 50%;
    left: 65px;
    transform: translateY(-50%);
    text-align: left;
    .name,
    .author {
      display: block;
      width: 70px;
      height: 20px;
      line-height: 20px;
    }
    .author {
      font-size: 12px;
    }
  }
  .operator {
    .absolute;
    top: 15%;
    right: 8px;
    text-align: center;
    .icon {
      display: block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      .fa-heart {
        color: #B82525;
      }
      cursor: pointer;
    }
  }
}
</style>
