<template>
  <div
    class="scroll"
    @mouseover="handleMouseOver"
    @mouseout="handleMouseOut"
    @mousewheel="handleMouseWheel"
    @DOMMouseScroll="handleMouseWheel">
    <div class="content" :style="scrollStyle">
      <slot></slot>
    </div>
    <div class="scroll-box">
      <span class="bar" :style="barStyle"  @mousedown="handleMouseDown"></span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'scroll',
  props: ['scrollIndex', 'total'],
  data() {
    return {
      top: 0,
      max: 0,
      barHeight: 0,
      initClientY: 0,
      isDraging: false,
      currentLine: 0,
      startLine: 4,
      limitLine: 6,
      lineHeight: 30
    };
  },
  computed: {
    ...mapGetters([
      'getCurrentSong'
    ]),
    scrollStyle() {
      let currentLine = this.currentLine;
      let translateY = currentLine <= this.startLine ? 0 : (
        currentLine === this.startLine + 1 ? 9 : (
          this.total - currentLine < this.limitLine ? '' : (
            currentLine - this.startLine) * this.lineHeight
        ));
      return {transform: `translateY(-${translateY}px)`, transition: 'transform .3s linear'};
    },
    barStyle() {
      return {top: `${this.top}px`};
    }
  },
  watch: {
    scrollIndex(index) {
      this.currentLine = index;
      this.scroll(index);
    },
    getCurrentSong(id) {
      if (id) this.top = 0;
    }
  },
  mounted() {
    let pNode = document.querySelector('.scroll-box');
    this.max = pNode.clientHeight;
    this.barHeight = pNode.children[0].clientHeight;
  },
  methods: {
    scroll(index) {
      let startLine = this.startLine;
      if (index <= startLine) return;
      let percent = index / this.total;
      let limit = this.max - this.barHeight;
      this.top = Math.min(percent * this.max, limit);
    },
    handleMouseOver() {
      this.isScroll = true;
    },
    handleMouseOut() {
      this.isScroll = false;
    },
    handleMouseWheel(e) {
      e.stopPropagation();
      e.preventDefault();
      let {type} = e;
      let top = this.top;
      let isUp = null;
      if (type === 'mousewheel') {
        isUp = e.wheelDelta > 0 ? Boolean(true) : false;
      } else if (type === 'DOMMouseScroll') {
        isUp = e.detail === 3 ? false : Boolean(true);
      }
      this.top = isUp ? (top ? Math.max(0, this.top - 25) : 0) : Math.min(this.top + 25, this.max - this.barHeight);
      this.topToLine();
    },
    topToLine() {
      let limit = this.max - this.barHeight;
      this.currentLine = Math.round(Math.min((this.top / limit) * this.total, this.total));
    },
    setTop(clientY) {
      let top = clientY - this.initClientY;
      let limit = this.max - this.barHeight;
      this.top = top < 0 ? 0 : (top > limit ? limit : top);
      this.topToLine();
    },
    handleDrag(e) {
      e.stopPropagation();
      if (this.isDraging) {
        this.setTop(e.clientY);
      }
    },
    handleDragEnd(e) {
      e.stopPropagation();
      if (this.isDraging) {
        setTimeout(() => {
          this.isDraging = false;
          this.setTop(e.clientY);
        }, 0);
        window.removeEventListener('mouseout', this.handleDrag);
        window.removeEventListener('mouseup', this.handleDragEnd);
      }
    },
    handleMouseDown(e) {
      e.stopPropagation();
      e.preventDefault();
      this.initClientY = this.initClientY ? this.initClientY : e.clientY;
      this.isDraging = true;
      window.addEventListener('mouseout', this.handleDrag);
      window.addEventListener('mouseup', this.handleDragEnd);
    }
  }
};
</script>

<style lang="less" scoped>
.scroll {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  .content {
    p {
      height: 30px;
      min-height: 30px;
      line-height: 30px;
      margin: 0;
    }
  }
  .scroll-box {
    position: absolute;
    top: 0;
    right: 0;
    width: 8px;
    height: 100%;
    border-right: 1px solid rgba(98, 98, 98, .5);
    cursor: pointer;
    .bar {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      width: 8px;
      height: 40px;
      background: rgba(98, 98, 98, .8);
      border-radius: 10px;
    }
  }
}
</style>
