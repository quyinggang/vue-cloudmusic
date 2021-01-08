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
          component: () => import('@/components/layouts/content'),
          redirect: '/fmusic',
          children: [
            {
              path: '/fmusic',
              name: 'fmusic',
              component: () => import('@/views/fmusic')
            },
            {
              path: '/selfFM',
              name: 'selfFM',
              component: () => import('@/views/self-fm')
            },
            {
              path: '/myLoves',
              name: 'myLoves',
              component: () => import('@/views/loves')
            },
            {
              path: '/commendMusics',
              name: 'commendMusics',
              component: () => import('@/views/commend-musics')
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
          component: () => import('@/views/song')
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
          component: () => import('@/views/mv')
        }
      ]
    }
  ]
});
