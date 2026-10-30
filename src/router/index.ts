import { createRouter, createWebHistory } from 'vue-router'

import AppView from '../views/AppView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/app',
      component: AppView,
      children: [
        { path: '', redirect: '/app/layout' },
        { path: 'layout', name: 'layout', component: () => import('../views/PageLayoutView.vue') },
        { 
          path: 'dataSource', 
          name: 'dataSource', 
          redirect: '/app/dataSource/1',
          component: () => import('../views/DataSourceView.vue'),
          children:[
            { path: ':id', name: 'dataSourceDetail', component: () => import('../views/DataSourceContent/DataSourceContent.vue') },
          ]
        },
        { path: 'actions', name: 'actions', component: () => import('../views/ActionsView.vue') }
      ]
    },
    {
      path: '/runner',
      name: 'runner',
      component: () => import('../views/RunnerView.vue')
    },
    { path: '/', redirect: '/app/layout' },
    // /:pathMatch动态参数，(.*)匹配任意字符，*是可重复参数，将内容按/分割为数组，将数组赋值给pathMatch
    { path: '/:pathMatch(.*)*', name: 'notFound', redirect: '/app/layout' }
  ]
})

export default router