<template>
  <div class="default-mode">
    <m-aside></m-aside>
    <article :class="getClasses">
      <router-view></router-view>
    </article>
  </div>
</template>

<script>
import MAside from './aside';
import MixinTheme from '@/mixins/mixin-theme';
export default {
  name: 'layout',
  mixins: [MixinTheme],
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
  },
  computed: {
    getClasses() {
      const theme = this.theme;
      return {
        'content': true,
        'change-bar': theme['audio'] !== 'transparent'
      };
    }
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

