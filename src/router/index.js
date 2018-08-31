import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/components/layouts/layout';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: '/content',
      children: [
        {
          path: '/content',
          name: 'content',
          component: resolve => require(['@/components/layouts/content'], resolve),
          redirect: '/fmusic',
          children: [
            {
              path: '/fmusic',
              name: 'fmusic',
              component: resolve => require(['@/views/fmusic'], resolve)
            },
            {
              path: '/selfFM',
              name: 'selfFM',
              component: resolve => require(['@/views/self-fm'], resolve)
            },
            {
              path: '/myLoves',
              name: 'myLoves',
              component: resolve => require(['@/views/loves'], resolve)
            },
            {
              path: '/commendMusics',
              name: 'commendMusics',
              component: (resolve) => require(['@/views/commend-musics'], resolve)
            }
          ]
        }
      ]
    },
    {
      path: '/song',
      component: Layout,
      children: [
        {
          path: '',
          name: 'song',
          component: resolve => require(['@/views/song'], resolve)
        }
      ]
    },
    {
      path: '/mv',
      component: Layout,
      children: [
        {
          path: '',
          name: 'mv',
          component: resolve => require(['@/views/mv'], resolve)
        }
      ]
    }
  ]
});
