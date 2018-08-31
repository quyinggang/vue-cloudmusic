<template>
  <transition name="slide-fade">
    <section
      :class="getClasses" 
      v-if="getIsOpen">
      <div class="ss-header">
        <span>皮肤选择</span>
        <span class="icon">
          <i class="fa fa-close" @click="close"></i>
        </span>
      </div>
      <div class="ss-content">
        <label class="title">主题</label>
        <div class="content">
          <figure
            v-for="(item, index) in themes"
            :key="index"
            :class="{active: item.isActive}">
            <span class="info" v-if="item.theme === 'purple'">魅惑紫</span>
            <img :src="item.src" @click="handleSelectSkin(item)">
          </figure>
        </div>
        <label class="title">纯色</label>
        <div class="content">
          <ul>
            <li
              :class="{'color-item': true, 'active': item.isActive}" 
              v-for="(item, index) in colors"
              :key="index" 
              :style="{background: item.color}"
              @click="handleSelectSkin(item)">
            </li>
          </ul>
        </div>
        <label class="title">自定义颜色</label>
        <div class="content">
          <color-range
            :isActive="isColorRange"
            @currentColor="handleCurrentSelect">
          </color-range>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
import ColorRange from './color-range';
import { mapActions } from 'vuex';
import MixinTheme from '@/mixins/mixin-theme';
export default {
  name: 'select-skins',
  mixins: [MixinTheme],
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ColorRange
  },
  data() {
    return {
      isOpen: false,
      theme: null,
      isColorRange: false,
      themes: [
        {theme: 'black', src: require('@/assets/images/black.png'), isActive: true},
        {theme: 'red', src: require('@/assets/images/red.png'), isActive: false},
        {theme: 'purple', src: require('@/assets/images/zi.png'), isActive: false}
      ],
      colors: [
        {color: '#FF5C8A', isActive: false},
        {color: '#FF7A9E', isActive: false},
        {color: '#FE76C8', isActive: false},
        {color: '#717FF9', isActive: false},
        {color: '#4791EB', isActive: false},
        {color: '#39AFEA', isActive: false}
      ]
    };
  },
  computed: {
    getIsOpen() {
      this.isOpen = this.isShow;
      return this.isOpen;
    },
    getClasses() {
      return {
        'select-skins': true,
        'is-not-block': this.theme['audio'] !== 'transparent'
      };
    }
  },
  methods: {
    close() {
      this.$emit('closeSelectSkins');
    },
    clearActive() {
      this.themes.forEach((item) => {
        item.isActive = false;
      });
      this.colors.forEach((item) => {
        item.isActive = false;
      });
    },
    handleCurrentSelect(color) {
      if (color !== '#000000') {
        this.isColorRange = true;
        this.clearActive();
        this.changeSkin(color);
      }
    },
    handleSelectSkin(item) {
      let skin = item.theme || item.color;
      this.changeSkin(skin);
      this.close();
      this.clearActive();
      item.isActive = true;
      this.isColorRange = false;
    },
    ...mapActions([
      'changeSkin'
    ])
  }
};
</script>

<style lang="less" scoped>
@keyframes slideFadeIn {
  from {
    transform: translate3d(-50%, -100%, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(-50%, -50%, 0);
    opacity: 1;
  }
}
@keyframes slideFadeOut {
  from {
    transform: translate3d(-50%, -50%, 0);
    opacity: 1;
  }
  to {
    transform: translate3d(-50%, -100%, 0);
    opacity: 0;
  }
}
.slide-fade-enter-active {
  -webkit-animation: slideFadeIn .3s;
  -moz-animation: slideFadeIn .3s;
  -ms-animation: slideFadeIn .3s;
  -o-animation: slideFadeIn .3s;
  animation: slideFadeIn .3s;
}
.slide-fade-leave-active {
  -webkit-animation: slideFadeOut .3s;
  -moz-animation: slideFadeOut .3s;
  -ms-animation: slideFadeOut .3s;
  -o-animation: slideFadeOut .3s;
  animation: slideFadeOut .3s;
  
}

.select-skins {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  background: #2D2F33;
  user-select: none;
  z-index: 9999;
  .ss-header {
    height: 30px;
    border-bottom: 1px solid #626262;
    box-sizing: border-box;
    span {
      display: inline-block;
      padding: 0 10px;
      width: 48%;
      height: inherit;
      line-height: 30px;
      box-sizing: border-box;
      &:last-child {
        padding: 0;
        font-size: 16px;
        text-align: right;
        cursor: pointer;
        &:hover {
          color: #fff;
        }
      }
    }
  }
  .ss-content {
    position: relative;
    color: #fff;
    .title {
      display: block;
      padding: 10px 0 0 10px;
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
    figure {
      position: relative;
      display: inline-block;
      margin: 1em 10px;
      padding: 2px;
      border: 1px solid transparent;
      cursor: pointer;
      .info {
        position: absolute;
        bottom: 5px;
        width: 96%;
        height: 20px;
        line-height: 20px;
        color: #fff;
        font-size: 12px;
        font-family: 'NSimSun';
        text-indent: 0.5em;
        background: rgba(0, 0, 0, .2);
      }
      &:first-child:hover {
        border-color: #16181C;
      }
      &:nth-of-type(2):hover {
        border-color: #B62424;
      }
      &:nth-of-type(3):hover {
        border-color: #7D73BA;
      }
    }
    ul {
      text-align: center;
      .color-item {
        position: relative;
        display: inline-block;
        margin: 6px;
        width: 40px;
        height: 40px;
        outline: 1px solid transparent;
        outline-offset: 2px;
        -moz-outline-offset: 2px;
        list-style: none;
        cursor: pointer;
        &:nth-of-type(1):hover {
            outline-color: #FF5C8A;
        }
        &:nth-of-type(2):hover {
            outline-color: #FF7A9E;
        }
        &:nth-of-type(3):hover {
            outline-color: #FE76C8;
        }
        &:nth-of-type(4):hover {
            outline-color: #717FF9;
        }
        &:nth-of-type(5):hover {
            outline-color: #4791EB;
        }
        &:nth-of-type(6):hover {
            outline-color: #39AFEA;
        }
      }
    }
  }
}

.is-not-black {
  color: rgba(255, 255, 255, .6);
  background: rgba(45, 47, 51, .8);
}
</style>