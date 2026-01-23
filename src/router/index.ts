import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/LoginLayout.vue'),
      meta: {
        requiresAuth: false
      },
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('@/pages/LoginPage.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/pages/RegisterPage.vue')
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: 'trades',
          name: 'trades',
          component: () => import('@/pages/TradePage.vue'),
          meta: {
            requiresAuth: false
          }
        },
        {
          path: 'trades/:id',
          name: 'trades-view',
          component: () => import('@/pages/TradeView.vue'),
          meta: {
            requiresAuth: false
          },
        },
        {
          path: 'card',
          name: 'card',
          component: () => import('@/pages/CardPage.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'trade-form',
          name: 'trade-form',
          component: () => import('@/pages/TradeForm.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'profile-card',
          name: 'profile-card',
          component: () => import('@/pages/ProfileCard.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'profile-trade',
          name: 'profile-trade',
          component: () => import('@/pages/ProfileTrade.vue'),
          meta: {
            requiresAuth: true
          }
        },
      ]
    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !token) {
    next({ name: 'login'})
  } else if(!requiresAuth && token && to.name === 'login') {
    next({ name: 'trades'})
  } else {
    next()
  }
})

export default router
