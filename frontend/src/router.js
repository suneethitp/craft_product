import { createRouter, createWebHistory } from 'vue-router'




const routes = [
  // {
  //   path: '/',
  //   name: 'suneethi',
  //   component: () => import('@/pages/suneethi.vue'),
  //   //  meta: { breadcrumb: 'suneethi' }
  // },
  // {
  //   path: '/',
  //   name:'Form',
  //   component:()=> import('@/pages/Form.vue'),
  //   // meta: { breadcrumb: 'Form' }
 
  // },
  // {
  //   path:'/',
  //   name:'Item',
  //   component:()=> import('@/pages/Item.vue'),
  // },
  {
    path:'/',
    name:'Frontpage',
    component:()=> import('@/pages/Frontpage.vue'),
   
  },
  {
    path:'/home',
    name:'Home',
    component:()=> import('@/pages/Home.vue'),
  },
  {
    path:'/accounting',
    name:'Accounting',
    component:()=> import('@/pages/Accounting.vue'),
  },
  {
    path:'/buying',
    name:'Buying',
    component:()=> import('@/pages/Buying.vue'),

  },
  {
    path:'/selling',
    name:'Selling',
    component:()=> import('@/pages/Selling.vue'),

  },
  {
    path:'/stock',
    name:'Stock',
    component:()=> import('@/pages/Stock.vue'),

  },
  {
    path:'/manufacturing',
    name:'Manufacturing',
    component:()=> import('@/pages/Manufacturing.vue'),

  },
  {
    path:'/assets',
    name:'Assets',
    component:()=> import('@/pages/Assets.vue'),
  },
  {
    path:'/hr',
    name:'HR',
    component:()=> import('@/pages/HR.vue'),
  },
  {
    path:'/quality',
    name:'Quality',
    component:()=> import('@/pages/Quality.vue'),

  },
  {
    path:'/projects',
    name:'Projects',
    component:()=> import('@/pages/Projects.vue'),

  },
   {
    path:'/support',
    name:'Support',
    component:()=> import('@/pages/Support.vue'),

  },
    {
    path:'/users',
    name:'Users',
    component:()=> import('@/pages/Users.vue'),

  },
   {
    path:'/crm',
    name:'CRM',
    component:()=> import('@/pages/CRM.vue'),

  },

]

let router = createRouter({
  history: createWebHistory('/frontend'),
  routes,
})

export default router
    