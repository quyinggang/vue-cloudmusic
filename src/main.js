// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Message from '@/components/message';
import store from './store/index';

import 'normalize.css';
import 'font-awesome/css/font-awesome.min.css';
Vue.config.productionTip = false;

// 全局注册message组件
Vue.component('message', Message);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
