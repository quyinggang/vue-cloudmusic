<template>
  <transition name="fade">
    <section class="message" v-show="isShowMessage" :style="messageStyle">
      <div class="message-header" v-show="isShowHeader">
        <span v-text="title"></span>
        <span class="icon" @click="handleClose(false)">
          <i class="fa fa-close"></i>
        </span>
      </div>
      <div class="message-content">
        <slot></slot>
      </div>
      <div class="message-footer" v-show="isShowFooter">
        <span class="confirm" @click="handleClose(true)">确认</span>
        <span class="cancel" @click="handleClose(false)">取消</span>
      </div>
    </section>
  </transition>  
</template>

<script>
export default {
  props: {
    isShowHeader: {
      type: Boolean,
      default: true
    },
    isShowFooter: {
      type: Boolean,
      default: false
    },
    isShowMessage: {
      type: Boolean,
      default: true
    },
    title: {
      default: '确认'
    },
    isTimeout: {
      type: Boolean,
      default: false
    },
    positionX: {
      default: '50%'
    },
    positionY: {
      default: '50%'
    }
  },
  data() {
    return {
      timer: null
    };
  },
  computed: {
    messageStyle() {
      let top = this.positionX;
      let left = this.positionY;
      return top === '50%' ? {top: top, left: left, transition: 'translate(-50%, -50%)'} : {top: `${top}px`, left: `${left}px`};
    }
  },
  watch: {
    isShowMessage(val) {
      if (val && this.isTimeout) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.handleClose();
        }, 2000);
      }
    }
  },
  methods: {
    handleClose(isConfirm) {
      this.$emit('close', isConfirm);
    }
  }
};
</script>

<style lang="less" scoped>
.transition {
  transition: opacity 300ms ease-in-out;
}
.fade-enter-active {
  opacity: 1;
  .transition;
}
.fade-leave-active {
  opacity: 0;
  .transition;
}

.message {
  position: fixed;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  user-select: none;
  z-index: 100;
  .message-header, 
  .message-content {
    background: #2d2f33;
  }

  .message-header {
    height: 30px;
    border-bottom: 1px solid rgba(59, 58, 61, 1);
    span {
      display: inline-block;
      padding: 0 10px;
      width: 48%;
      height: inherit;
      line-height: 30px;
      box-sizing: border-box;
      &:last-child {
        font-size: 16px;
        text-align: right;
        cursor: pointer;
      }
    }
  }
  .message-content {
    color: #fff;
  }
  .message-footer {
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: rgba(41, 43, 47, 1);
    .confirm,
    .cancel {
      display: inline-block;
      width: 60px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 5px;
      background: rgba(46, 78, 126, 1);
      cursor: pointer;
    }
    .cancel {
      margin-left: 20px;
      background: rgba(55, 56, 60, 1);
    }
  }
}
</style>