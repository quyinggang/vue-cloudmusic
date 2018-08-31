<template>
  <section class="slider">
    <div class="title" v-if="title">{{title}}：</div>
    <div class="container">
      <div class="slider-runway" @click="handleClickBar">
        <div
          class="slider-btn-wrapper"
          @mousedown="hanldeButtonDown"
          @mouseover="handleShowToolTip(true)"
          @mouseout="handleShowToolTip(false)"
          :style="wrapperStyle">
          <div class="tooltip" v-show="isShowTooltip">{{currentValue}}</div>
          <div class="slider-btn"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'vue-slider',
  props: {
    title: {
      type: String,
      default: ''
    },
    min: {
      type: String,
      default: '0'
    },
    max: {
      type: String,
      default: '100'
    }
  },
  data() {
    return {
      isShowTooltip: false,
      width: 0,
      dragging: false,
      initClientX: 0,
      left: -10,
      range: null,
      currentValue: 0
    };
  },
  computed: {
    wrapperStyle() {
      return {left: this.left + 'px'};
    }
  },
  watch: {
    left(val) {
      this.currentValue = window.parseInt((val + 10) / this.width * this.max);
      this.postCurrentValue();
    }
  },
  methods: {
    handleShowToolTip(isShow) {
      this.isShowTooltip = isShow;
    },
    postCurrentValue() {
      this.$emit('currentValue', this.currentValue);
    },
    setLeft(clientX) {
      let range = this.range;
      let left = Math.max(range[0], Math.min(clientX - this.initClientX, range[1]));
      this.$set(this, 'left', left);
    },
    handleClickBar(e) {
      e.stopPropagation();
      this.left = e.offsetX;
    },
    hanldeButtonDown(e) {
      e.stopPropagation();
      e.preventDefault();
      let target = e.target.className === 'slider-btn' ? e.target.parentNode : e.target;
      this.handleDragStart(target, e.clientX);
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.handleDragEnd);
    },
    handleDragStart(node, clientX) {
      let r = node.offsetWidth / 2;
      let width = node.parentNode.offsetWidth;
      this.initClientX = this.initClientX ? this.initClientX : clientX;
      this.dragging = true;
      this.range = [-r, width - r];
      this.width = width;
    },
    handleDrag(e) {
      e.stopPropagation();
      if (this.dragging) {
        this.isShowTooltip = true;
        this.setLeft(e.clientX);
      }
    },
    handleDragEnd(e) {
      e.stopPropagation();
      if (this.dragging) {
        setTimeout(() => {
          this.isShowTooltip = false;
          this.dragging = false;
          this.setLeft(e.clientX);
        }, 0);
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleDragEnd);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.slider {
  position: relative;
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: transparent;
  .title {
    display: inline-block;
    width: 30px;
  }
  .container {
    display: inline-block;
    width: 80%;
    .slider-runway {
      position: relative;
      top: 50%;
      left: 50%;
      height: 5px;
      width: 100%;
      border-radius: 5px;
      transform: translate(-50%, -50%); 
      background-size: cover;
      cursor: pointer;
      background: red;
      .slider-btn-wrapper {
        position: absolute;
        top: 50%;
        left: -10px;
        width: 20px;
        height: 20px;
        margin-top: -9px;
        text-align: center;
        background: transparent;
        z-index: 1001;
        .tooltip {
          position: absolute;
          bottom: 25px;
          width: 25px;
          height: 18px;
          line-height: 18px;
          font-size: 10px;
          text-align: center;
          border-radius: 5px;
          background: #1F2D3D;
        }
        .tooltip::after {
          position: absolute;
          bottom: -5px;
          left: 50%;
          content: "";
          width: 0;
          height: 0;
          transform: translateX(-50%);
          border-top: 5px solid #1F2D3D;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
        }
        .slider-btn {
          position: absolute;
          top: 2px;
          left: 3px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 1px solid #D9D9D9;
          box-sizing: border-box;
          box-shadow: 0 0 .3px .3px #D9D9D9;
          background: #fff;
          cursor: pointer;
          z-index: 100;
        }
      }
    }
  }
}
</style>
