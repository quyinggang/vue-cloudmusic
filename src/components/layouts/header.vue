<template>
  <header
    :class="getClasses"
    :style="{background: theme['header']}">
    <ul class="nav">
      <li class="nav-left title">
        <img src="../../assets/images/title.png" alt="title">
        <span>{{title}}</span>
      </li>
    </ul>
  </header>
</template>

<script>
import MixinTheme from '@/mixins/mixin-theme';
export default {
  name: 'm-header',
  mixins: [MixinTheme],
  data() {
    return {
      title: '云音乐',
      search: '',
      theme: null,
      classes: {
        header: 'header',
        showBorder: 'show-border'
      }
    };
  },
  computed: {
    getClasses() {
      const theme = this.theme;
      return {
        'header': true,
        'show-border': theme['audio'] === 'transparent'
      };
    }
  }
};
</script>

<style lang="less" scoped>
.show-border {
  border-bottom: 2px solid #B62424;
}
.header {
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  .nav {
    height: inherit;
    li {
      list-style: none;
      text-align: left;
      float: left;
    }
    .nav-left {
      position: relative;
      width: 200px;
      height: 48px;
      line-height: 48px;
      color: #fff;
      font-size: 18px;
      img {
        position: absolute;
        top: 10px;
        left: 22px;
      }
      span {
        margin-left: 48px;
      }
    }
    .nav-center {
      position: relative;
      width: 300px;
      height: 48px;
      line-height: 48px;
      div{
        display: inline-block;
      }
      .control {
        width: 50px;
        i {
          position: absolute;
          display: inline-block;
          top: 50%;
          left: 0;
          width: 25px;
          height: 20px;
          margin-top: -10px;
          text-align: center;
          border: 1px solid #000;
          border-radius: 4px 0 0 4px;
          &:last-child {
            left: 25px;
            border-left: 1px solid transparent;
            border-radius: 0 4px 4px 0;
          }
        }
      }
      .el-input {
          width: 200px;
          margin-left: 10px;
          .el-input__inner  {
            height: 20px;
            border: none;
            border-radius: 10px;
            background: #151517;
          }
      }
    }
  }
}
</style>
