<template>
  <section class="cm-carousel">
    <ul class="carousel-content">
      <li
        :class="[classes.item, item.status === 0 ? classes.active : (item.status === -1 ? classes.left : (item.status === 1 ? classes.right : ''))]"
        v-for="(item, index) in images"
        :key="index"
        @click="handleItemClick(item.status, index)">
        <img :src="item.src" alt="image">
      </li>
    </ul>
    <span class="control-left" @click="handleCarousel('left')">
      <i class="fa fa-chevron-left"></i>
    </span>
    <span class="control-right" @click="handleCarousel('right')">
      <i class="fa fa-chevron-right"></i>
    </span>
    <ul class="control-bar">
      <li
        :class="[classes.barItem, item.status === 0 ? classes.active : '']"
        v-for="(item, index) in images"
        :key="index"
        @mouseover="handleClickBar(index)">
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
      activeIndex: 0,
      classes: {
        item: 'item',
        active: 'active',
        left: 'left',
        right: 'right',
        barItem: 'bar-item'
      },
      images: [
        {src: require('../assets/images/item0.jpg'), status: 0},
        {src: require('../assets/images/item1.jpg'), status: 1},
        {src: require('../assets/images/item2.jpg'), status: -2},
        {src: require('../assets/images/item3.jpg'), status: -2},
        {src: require('../assets/images/item4.jpg'), status: -2},
        {src: require('../assets/images/item5.jpg'), status: -2},
        {src: require('../assets/images/item6.jpg'), status: -2},
        {src: require('../assets/images/item7.jpg'), status: -1}
      ]
    };
  },
  mounted() {
    setInterval(() => {
      if (!this.isHumanClick) {
        this.handleCarousel('right', true);
      }
    }, 5000);
  },
  methods: {
    changeStatus(items) {
      this.images.forEach((item) => {
        if (item.status !== -2) {
          item.status = -2;
        }
      });
      items.forEach((item) => {
        this.$set(item.obj, 'status', item.status);
      });
    },
    handleItemClick(status, index) {
      if (status === -1 || status === 1) {
        this.handleClickBar(index);
      }
    },
    handleClickBar(index) {
      this.activeIndex = index;
      this.handleCarousel();
    },
    handleCarousel(type, isHumanClick) {
      let images = this.images;
      let len = images.length;
      let activeIndex = this.activeIndex;
      let nextActiveIndex = null;
      let nextleftIndex = null;
      let nextRightIndex = null;
      this.isHumanClick = !isHumanClick;
      if (type === 'left') {
        if (activeIndex - 2 >= 0) {
          nextleftIndex = activeIndex - 2;
          nextActiveIndex = activeIndex - 1;
        } else if (activeIndex - 1 >= 0) {
          nextleftIndex = len - 1;
          nextActiveIndex = activeIndex - 1;
        } else {
          nextleftIndex = len - 2;
          nextActiveIndex = len - 1;
        }
        nextRightIndex = activeIndex;
      } else if (type === 'right') {
        if (activeIndex + 2 <= len - 1) {
          nextActiveIndex = activeIndex + 1;
          nextRightIndex = activeIndex + 2;
        } else if (activeIndex + 1 <= len - 1) {
          nextActiveIndex = activeIndex + 1;
          nextRightIndex = 0;
        } else {
          nextActiveIndex = 0;
          nextRightIndex = 1;
        }
        nextleftIndex = activeIndex;
      } else {
        let index = this.activeIndex;
        if (index === 0) {
          nextleftIndex = len - 1;
          nextRightIndex = index + 1;
        } else if (index === len - 1) {
          nextleftIndex = index - 1;
          nextRightIndex = 0;
        } else {
          nextleftIndex = index - 1;
          nextRightIndex = index + 1;
        }
        nextActiveIndex = index;
      }
      this.changeStatus([
        {obj: images[nextActiveIndex], status: 0},
        {obj: images[nextleftIndex], status: -1},
        {obj: images[nextRightIndex], status: 1}
      ]);
      this.activeIndex = nextActiveIndex;
      if (!isHumanClick) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.isHumanClick = false;
        }, 1000);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.cm-carousel {
  position: relative;
  width: 100%;
  height: 240px;
  .carousel-content {
    width: 100%;
    height: 220px;
    list-style: none;
    .item {
      position: absolute;
      top: 0;
      left: 50%;
      width: 50%;
      height: 200px;
      z-index: 1;
      transform: scale(.3) translateX(-50%);
      z-index: 1;
      cursor: pointer;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .active,
    .left,
    .right {
      display: block;
      z-index: 10;
      transition: transform 300ms linear;
    }
    .active {
      transform: scaleY(1) translateX(-50%);
      z-index: 100;
    }
    .left {
      transform: scaleY(.9) translateX(-100%);
    }
    .right {
      transform: scaleY(.9) translateX(0);
    }
    .right::after,
    .left::after {
      position: absolute;
      top: 0;
      left: 0;
      content: "";
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .5);
    }
  }
  .control-left,
  .control-right {
    position: absolute;
    top: 0;
    width: 20px;
    height: 210px;
    line-height: 210px;
    font-size: 20px;
    text-align: center;
    background: transparent;
    z-index: 101;
    cursor: pointer;
    opacity: 0;
    &:hover {
      color: rgba(255, 255, 255, .8);
      opacity: 1;
    }
  }

  .control-left {
    left: 0;
  }
  .control-right {
    right: 0;
  }
  .control-bar {
    list-style: none;
    .bar-item {
      display: inline-block;
      width: 18px;
      height: 2px;
      margin-right: 5px;
      color: transparent;
      background: #2E3033;
      cursor: pointer;
    }
    .active {
      background: #7F8082;
    }
  }
}
</style>
