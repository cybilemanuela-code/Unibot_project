<template>
  <!--
    AppLayout — Authenticated shell
    Sidebar left + main content right.
    Sidebar collapses on mobile (hamburger toggle).
  -->
  <div class="flex h-screen bg-surface-50 overflow-hidden">

    <!-- ── Sidebar ─────────────────────────────────────────── -->
    <aside :class="['flex flex-col w-56 bg-white border-r border-surface-200 shrink-0 z-20 transition-transform duration-300',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      'fixed md:static inset-y-0 left-0']">

      <!-- Logo -->
      <div class="px-5 py-5 border-b border-surface-100">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
          </div>
          <div>
            <p class="font-display font-semibold text-gray-900 leading-none">Unibot</p>
            <p class="text-xs text-gray-400 mt-0.5">Academic Assistant</p>
          </div>
        </div>
      </div>

      <!-- Primary nav -->
      <nav class="flex-1 px-3 py-4 space-y-1">
        <RouterLink to="/app/chat"    custom v-slot="{ isActive, navigate }">
          <div :class="['nav-item', isActive && 'active']" @click="navigate(); sidebarOpen = false">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
            Chatbot
          </div>
        </RouterLink>

        <RouterLink to="/app/support" custom v-slot="{ isActive, navigate }">
          <div :class="['nav-item', isActive && 'active']" @click="navigate(); sidebarOpen = false">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Support
          </div>
        </RouterLink>

        <RouterLink to="/app/settings" custom v-slot="{ isActive, navigate }">
          <div :class="['nav-item', isActive && 'active']" @click="navigate(); sidebarOpen = false">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Settings
          </div>
        </RouterLink>
      </nav>

      <!-- Bottom nav -->
      <div class="px-3 py-4 border-t border-surface-100 space-y-1">
        <div class="nav-item" @click="goSupport">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Support
        </div>
        <div class="nav-item text-red-400 hover:text-red-600 hover:bg-red-50" @click="logout">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Sign Out
        </div>

        <!-- User pill -->
        <RouterLink to="/app/settings" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface-100 transition-colors mt-2 cursor-pointer">
          <div class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0 overflow-hidden">
            <img v-if="authStore.avatar" :src="authStore.avatar" class="w-full h-full object-cover" />
            <span v-else class="text-sm font-bold text-brand-600">{{ initials }}</span>
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-semibold text-gray-800 truncate">{{ authStore.fullName }}</p>
            <p class="text-xs text-gray-400 capitalize">{{ authStore.role }}</p>
          </div>
        </RouterLink>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black/30 z-10 md:hidden" @click="sidebarOpen = false"/>

    <!-- ── Main content area ──────────────────────────────── -->
    <main class="flex-1 overflow-hidden flex flex-col">
      <!-- Mobile top bar -->
      <div class="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-surface-200">
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 rounded-lg hover:bg-surface-100 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="flex items-center gap-2 text-brand-600 font-display font-semibold">Unibot</div>
        <div class="w-9" />
      </div>

      <RouterView class="flex-1 overflow-hidden" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { firebaseAuthService } from '@/services/firebaseAuthService'

const router    = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const initials = computed(() => {
  const name = authStore.fullName
  return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'
})

function goSupport() { router.push('/app/support'); sidebarOpen.value = false }

async function logout() {
  try {
    await firebaseAuthService.logout()
  } finally {
    authStore.clearSession()
    router.push('/login')
  }
}
</script>