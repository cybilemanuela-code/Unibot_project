import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',         redirect: '/login' },
    { path: '/register', component: () => import('@/pages/Register.vue'), meta: { guest: true } },
    { path: '/login',    component: () => import('@/pages/Login.vue'),    meta: { guest: true } },
    {
      path: '/app',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '',        redirect: '/app/chat' },
        { path: 'chat',    component: () => import('@/pages/Chatbot.vue') },
        { path: 'support', component: () => import('@/pages/Support.vue') },
        { path: 'settings',component: () => import('@/pages/Settings.vue') },
      ]
    }
  ]
})

// Navigation guards
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login'
  if (to.meta.guest       && auth.isLoggedIn)  return '/app/chat'
})

export default router