<template>
  <div class="color-range">
    <div :class="[classes.colorShow, isActive ? classes.active : '']" :style="colorShowStyle">
    </div>
    <div class="rgb-range">
      <div class="container">
        <vue-slider class="control r" title="R" min="0" max="255" @currentValue="getCurrentRValue"></vue-slider>
      </div>
      <div class="container">
        <vue-slider class="control g" title="G" min="0" max="255" @currentValue="getCurrentGValue"></vue-slider>
      </div>
      <div class="container">
        <vue-slider class="control b" title="B" min="0" max="255" @currentValue="getCurrentBValue"></vue-slider>
      </div>
    </div>
  </div>
</template>

<script>
import vueSlider from './vueSlider';
export default {
  name: 'color-range',
  props: {
    isActive: Boolean,
    default: false
  },
  components: {
    vueSlider
  },
  data() {
    return {
      classes: {
        colorShow: 'color-show',
        active: 'active'
      },
      currentRGB: {
        r: 0,
        g: 0,
        b: 0
      }
    };
  },
  computed: {
    colorShowStyle() {
      let {r, g, b} = this.currentRGB;
      let [hexR, hexG, hexB] = [this.pad(r.toString(16)), this.pad(g.toString(16)), this.pad(b.toString(16))];
      let color = `#${hexR}${hexG}${hexB}`;
      this.postSelectColor(color);
      return {background: color};
    }
  },
  methods: {
    pad(val) {
      return val < 10 ? '0' + val : val;
    },
    postSelectColor(val) {
      this.$emit('currentColor', val);
    },
    getCurrentRValue(val) {
      this.$set(this.currentRGB, 'r', val);
    },
    getCurrentGValue(val) {
      this.$set(this.currentRGB, 'g', val);
    },
    getCurrentBValue(val) {
      this.$set(this.currentRGB, 'b', val);
    }
  }
};
</script>

<style lang="less" scoped>
.color-range {
  .color-show {
    position: relative;
    display: inline-block;
    width: 30%;
    height: 80px;
    border: 10px solid transparent;
    box-sizing: border-box;
    background-clip: content-box !important;
  }
  .active::before {
      position: absolute;
      bottom: 2px;
      right: -2px;
      content: "";
      width: 10px;
      height: 5px;
      border-left: 3px solid #fff;
      border-bottom: 3px solid #fff;
      transform: rotate(-45deg);
      background: transparent;
      z-index: 102;
  }
  .active::after {
    position: absolute;
      bottom: -5px;
      right: -5px;
      content: "";
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #B82525;
      z-index: 101;
  }
  .rgb-range {
    display: inline-block;
    width: 65%;
  }
}
</style>
