<template>
  <aside class="aside" :style="getStyle">
    <section
      class="menu"
      v-for="(item, index) in menu"
      :key="index">
      <label class="title">{{item.title}}</label>
      <ul class="menu-item">
        <li v-for="(child, index) in item.childs" 
          :key="index"
          :style="[child.router === active ? { borderColor: theme['aside'].borderActive } : '']"
          :class="[theme['audio'] === 'transparent' ? '' : classes.isNotBlack, child.router === active ? classes.active : '']"
          @click="handleSelection(child.router)">
          <i :class="child.icon"></i>
            {{child.content}}
        </li>
      </ul>
    </section>
    <select-skins
      :isShow="isShow"
      @closeSelectSkins="closeSelectSkins">
    </select-skins>
  </aside>
</template>

<script>
import SelectSkins from '../select-skins';
import MixinTheme from '@/mixins/mixin-theme';
import session from '@/api/persist-data';
import * as consts from '@/api/consts';
export default {
  name: 'm-aside',
  components: {
    SelectSkins
  },
  mixins: [MixinTheme],
  data() {
    return {
      theme: null,
      isShow: false,
      active: '/fmusic',
      classes: {
        active: 'active',
        isNotBlack: 'is-not-black'
      },
      menu: {
        menuItem1: {
          title: '推荐',
          childs: [
            {content: '发现音乐', icon: 'fa fa-music', router: '/fmusic'},
            {content: '私人FM', icon: 'fa fa-podcast', router: '/selfFM'}
          ]
        },
        menuItem2: {
          title: '创建的歌单',
          childs: [
            {content: '我喜欢的音乐', icon: 'fa fa-heart-o', router: '/myLoves'}
          ]
        },
        menuItem3: {
          title: '自定义',
          childs: [
            {content: '个性换肤', icon: 'fa fa-leaf', router: 'changeIcon'}
          ]
        }
      }
    };
  },
  computed: {
    getCurrentRoutePath() {
      return this.$route.path;
    },
    getStyle() {
      const theme = this.theme;
      return {
        background: theme['aside'].background,
        borderColor: theme['aside'].border
      };
    }
  },
  watch: {
    getCurrentRoutePath(path) {
      this.handleSelection(path);
    }
  },
  mounted() {
    let seActive = session.getItem(consts.ASIDE_ACTIVE);
    if (!seActive) return;
    this.active = seActive;
  },
  methods: {
    handleSelection(router) {
      if (router === 'changeIcon') {
        this.isShow = !this.isShow;
      } else {
        this.active = router;
        this.$router.push({path: `${router}`});
        session.setItem(consts.ASIDE_ACTIVE, router);
      }
    },
    closeSelectSkins() {
      this.isShow = false;
    }
  }
};
</script>

<style lang="less" scoped>
.aside {
  float: left;
  width: 200px;
  height: 100%;
  min-height: 600px;
  padding-top: 5px;
  text-align: left;
  border-right: 1px solid transparent;
  box-sizing: border-box;
  .menu {
    .title {
      display: block;
      margin: 10px 0;
      text-indent: 1em;
    }
    .menu-item {
      list-style: none;
      li {
        height: 35px;
        line-height: 35px;
        padding-left: 22px;
        border-left: 3px solid transparent;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          color: #fff;
        }
        i {
          margin-right: 5px;
        }
      }
      .active {
        color: #fff;
        border-left: 3px solid transparent;
        background: rgba(38, 40, 44, .8);
      }
      .active.is-not-black {
        color: #000;
        background: rgba(38, 40, 44, .1);
      }
      .is-not-black:hover {
        color: #000;
      }
    }
  }
}
</style>
