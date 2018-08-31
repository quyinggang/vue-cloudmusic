<template>
  <div class="collect-message">
    <message
      :isShowMessage="message.isShow" 
      :isShowHeader="false" 
      :isTimeout="true"
      @close="handleClose">
      <p class="p">
        <span class="icon">
          <i :class="[message.isCheck ? classes.check : classes.close]"></i>
        </span>
        <span>{{addOrCancelMessage}}</span>
      </p>
    </message>
  </div>
</template>

<script>
export default {
  props: ['message'],
  data() {
    return {
      classes: {
        check: 'fa fa-check',
        close: 'fa fa-close'
      }
    };
  },
  computed: {
    addOrCancelMessage() {
      let msg = null;
      this.$set(this.message, 'isCheck', true);
      switch (this.message.status) {
      case 'add':
        msg = '已添加到我喜欢的歌曲';
        break;
      case 'delete':
        msg = '取消喜欢成功';
        break;
      case 'reAdd':
        this.message.isCheck = false;
        msg = '歌曲已存在';
        break;
      }
      return msg;
    }
  },
  methods: {
    handleClose() {
      this.message.isShow = false;
    }
  }
};
</script>

<style lang="less" scoped>
.collect-message {
  position: fixed;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  user-select: none;
  z-index: 100;
  .p {
    padding: 20px;
    margin: 0;
    font-size: 16px;
    .icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin-right: 5px;
      color: rgba(68, 68, 68, 1);
      text-align: center;
      border-radius: 50%;
      background: #F5F5F5;
    }
  }
}
</style>
