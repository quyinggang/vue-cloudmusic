<template>
  <div class="container" :style="{color: theme['font']}">
    <m-header></m-header>
    <div class="layout-content" :style="contentStyle">
      <router-view></router-view>
    </div>
    <m-footer v-show="showFooter"></m-footer>
    <m-audio v-show="getShowMiNiAudio"></m-audio>
  </div>
</template>

<script>
import MHeader from './header';
import MAside from './aside';
import MFooter from './footer';
import MAudio from '../mini-audio';
import MixinTheme from '@/mixins/mixin-theme';
import { mapGetters } from 'vuex';
export default {
  name: 'layout',
  mixins: [MixinTheme],
  components: {
    MHeader,
    MAside,
    MFooter,
    MAudio
  },
  data() {
    return {
      theme: null,
      isShowFooter: true,
      classes: {
        content: 'content',
        changeBar: 'change-bar'
      }
    };
  },
  computed: {
    showFooter() {
      let path = this.$route.path;
      this.isShowFooter = String(path).indexOf('/mv') >= 0 ? Boolean(false) : true;
      return this.isShowFooter;
    },
    contentStyle() {
      let theme = this.theme;
      let color = '#DCDDE4';
      let styles = null;
      if (theme['audio'] !== 'transparent') {
        color = '#333';
      }
      styles = {background: theme['content'].background, color: `${color} ! important`};
      if (!this.isShowFooter) {
        styles['height'] = 'calc(100% - 50px)';
      }
      return styles;
    },
    ...mapGetters([
      'getShowMiNiAudio'
    ])
  }
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  .layout-content {
    height: calc(~"100% - 100px");
    min-height: 600px;
  }
}
</style>

