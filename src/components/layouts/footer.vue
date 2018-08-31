<template>
  <footer class="footer" :style="footerStyle">
    <vue-audio></vue-audio>
  </footer>
</template>

<script>
import VueAudio from '../vue-audio';
import MixinTheme from '@/mixins/mixin-theme';
export default {
  name: 'm-footer',
  mixins: [MixinTheme],
  components: {
    VueAudio
  },
  data() {
    return {
      theme: null
    };
  },
  computed: {
    footerStyle() {
      let audio = this.theme.audio;
      let bg = '#222225';
      let border = '#23262C';
      if (audio !== 'transparent') {
        bg = '#F5F5F7';
        border = '#E1E1E2';
      }
      return { background: bg, borderTop: `1px solid ${border}` };
    }
  }
};
</script>

<style lang="less" scoped>
.footer {
  position: relative;
  width: 100%;
  height: 50px;
  border-top: 1px solid transparent;
  box-sizing: border-box;
  z-index: 100;
}
</style>
