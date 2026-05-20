import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────────────────
  const user  = ref(JSON.parse(localStorage.getItem('unibot_user') || 'null'))
  const token = ref(localStorage.getItem('unibot_token') || null)

  // ── Getters ────────────────────────────────────────────────────
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const fullName   = computed(() => user.value?.name || '')
  const role       = computed(() => user.value?.role || 'student')
  const avatar     = computed(() => user.value?.avatar || null)

  // ── Actions ────────────────────────────────────────────────────
  function setSession(userData, authToken) {
    user.value  = userData
    token.value = authToken
    localStorage.setItem('unibot_user',  JSON.stringify(userData))
    localStorage.setItem('unibot_token', authToken)
  }

  function clearSession() {
    user.value  = null
    token.value = null
    localStorage.removeItem('unibot_user')
    localStorage.removeItem('unibot_token')
  }

  function updateUser(updates) {
    user.value = { ...user.value, ...updates }
    localStorage.setItem('unibot_user', JSON.stringify(user.value))
  }

  return { user, token, isLoggedIn, fullName, role, avatar, setSession, clearSession, updateUser }
})