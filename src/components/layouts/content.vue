<template>
  <div class="default-mode">
    <m-aside></m-aside>
    <article :class="[classes.content, theme['audio'] !== 'transparent' ? classes.changeBar : '']">
        <router-view></router-view>
    </article>
  </div>
</template>

<script>
import MAside from './aside';
import mixinTheme from '@/mixins/mixin-theme';
export default {
  name: 'layout',
  mixins: [mixinTheme],
  components: {
    MAside
  },
  data() {
    return {
      theme: null,
      classes: {
        content: 'content',
        changeBar: 'change-bar'
      }
    };
  }
};
</script>

<style lang="less" scoped>
.default-mode {
  width: 100%;
  height: 100%;
  .content {
    height: 100%;
    min-height: 600px;
    margin-left: 200px;
    padding-top: 20px;
    box-sizing: border-box;
    overflow: auto;
    &::-webkit-scrollbar {  
      width: 8px;
      background: #16181c;  
    }
    &::-webkit-scrollbar-track {
      background: transparent;  
    } 
    &::-webkit-scrollbar-thumb {  
      border-radius: 10px; 
      background: #2D2F32;  
    } 
    &::-webkit-scrollbar-thumb:hover {
      background: rgba(147, 147, 140, .5);   
    } 
  }
  .change-bar {
    &::-webkit-scrollbar {  
      width: 8px;
      background: #FAFAFA;  
    }
    &::-webkit-scrollbar-track {
      background: transparent;  
    } 
    &::-webkit-scrollbar-thumb {  
      border-radius: 10px; 
      background: #E1E1E2;  
    } 
    &::-webkit-scrollbar-thumb:hover {
      background: #CFCFD1;   
    } 
  }
}
</style>

