<template>
  <!--
    ChatPage — Image 3
    Full-height chat interface.
    Header | Messages (scrollable) | Quick chips | Input bar
  -->
  <div class="flex flex-col h-full bg-surface-50">

    <!-- ── Top bar ─────────────────────────────────────────── -->
    <header class="flex items-center justify-between px-6 py-4 bg-white border-b border-surface-200 shrink-0">
      <div class="flex items-center gap-3">
        <h1 class="font-display text-lg font-semibold text-gray-900">Academic Chat</h1>
        <span class="text-xs font-semibold text-green-600 bg-green-50 border border-green-200
                     px-2.5 py-1 rounded-full tracking-wide">ACTIVE SESSION</span>
        <!-- Guest question limit badge -->
        <span v-if="authStore.isGuest" :class="['text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide',
          guestSession.getRemainingQuestions() > 1
            ? 'text-blue-600 bg-blue-50 border border-blue-200'
            : 'text-amber-600 bg-amber-50 border border-amber-200'
        ]">
          {{ guestSession.getRemainingQuestions() }} {{ guestSession.getRemainingQuestions() === 1 ? 'question' : 'questions' }} left
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button class="p-2 rounded-lg hover:bg-surface-100 text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>
        <button class="p-2 rounded-lg hover:bg-surface-100 text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- ── Messages area ─────────────────────────────────────  -->
    <div ref="messagesEl" class="flex-1 overflow-y-auto px-6 py-6">
      <!-- Date separator -->
      <div class="flex items-center justify-center mb-6">
        <span class="text-xs text-gray-400 bg-surface-200 px-3 py-1 rounded-full">TODAY</span>
      </div>

      <!-- Message list -->
      <ChatMessage
        v-for="msg in chatStore.messages"
        :key="msg.id"
        :message="msg"
      />

      <!-- Typing indicator -->
      <TypingIndicator v-if="chatStore.isTyping" />

      <!-- Anchor for auto-scroll -->
      <div ref="bottomEl" />
    </div>

    <!-- ── Quick-topic chips ──────────────────────────────── -->
    <div class="px-6 py-3 flex items-center justify-center gap-3 flex-wrap shrink-0">
      <button
        v-for="chip in quickTopics"
        :key="chip.label"
        class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-200 hover:bg-brand-50
               hover:text-brand-600 text-sm text-gray-600 font-medium transition-all duration-150"
        @click="sendQuick(chip.text)"
      >
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path :d="chip.icon"/>
        </svg>
        {{ chip.label }}
      </button>
    </div>

    <!-- ── Input bar ─────────────────────────────────────── -->
    <div class="px-6 py-4 bg-white border-t border-surface-200 shrink-0">
      <div class="flex items-end gap-3 bg-surface-50 border border-surface-200 rounded-2xl px-4 py-3
                  focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/10 transition-all">
        <!-- Attachment button -->
        <button class="text-gray-400 hover:text-brand-500 transition-colors shrink-0 mb-0.5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
          </svg>
        </button>

        <!-- Textarea (auto-grows) -->
        <textarea
          ref="textareaEl"
          v-model="inputText"
          placeholder="Ask Unibot a question..."
          rows="1"
          class="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400
                 outline-none resize-none leading-relaxed max-h-32"
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.enter.shift.exact="() => {}"
          @input="autoResize"
        />

        <!-- Send button -->
        <button
          :class="['w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200',
            inputText.trim() && !chatStore.isTyping
              ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-sm'
              : 'bg-surface-200 text-gray-400 cursor-not-allowed']"
          :disabled="!inputText.trim() || chatStore.isTyping"
          @click="sendMessage"
        >
          <!-- Spinner during loading -->
          <svg v-if="chatStore.isTyping" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <!-- Send icon when not loading -->
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>

      <!-- Footer note -->
      <p class="text-center text-xs text-gray-400 mt-2">
        Unibot AI · Information based on 2023–2024 academic data
      </p>
    </div>
  </div>

  <!-- Guest Limit Overlay -->
  <div v-if="chatStore.showGuestLimitOverlay" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8">
      <!-- Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
      </div>

      <!-- Text -->
      <h2 class="text-2xl font-semibold text-gray-900 text-center mb-2">Question Limit Reached</h2>
      <p class="text-gray-600 text-center mb-6">
        You've used all 3 guest questions. Sign in to continue asking unlimited questions.
      </p>

      <!-- Buttons -->
      <div class="flex flex-col gap-3">
        <button
          @click="handleLoginClick"
          class="w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors"
        >
          Sign In
        </button>
        <button
          @click="handleSignupClick"
          class="w-full py-3 px-4 border-2 border-brand-200 hover:border-brand-300 text-brand-600 font-semibold rounded-lg transition-colors"
        >
          Create Account
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore }   from '@/stores/chatStore'
import { useAuthStore }   from '@/stores/authStore'
import { useGuestSession } from '@/composables/useGuestSession'
import { firestoreService } from '@/services/firestoreService'
import ChatMessage        from '@/components/chatbot/ChatMessage.vue'
import TypingIndicator    from '@/components/chatbot/TypingIndicator.vue'

const router = useRouter()
const chatStore  = useChatStore()
const authStore  = useAuthStore()
const guestSession = useGuestSession()
const inputText  = ref('')
const messagesEl = ref(null)
const bottomEl   = ref(null)
const textareaEl = ref(null)
const currentChatId = ref(null)

const quickTopics = [
  { label: 'Admissions',    text: 'Tell me about admission requirements.',    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Financial Aid', text: 'What is the status of my financial aid?', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { label: 'Campus Visits', text: 'When is the next campus visit scheduled?', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
]

onMounted(async () => {
  // Initialize guest session for non-logged-in users
  if (!authStore.uid) {
    guestSession.initGuestSession()
    return
  }

  chatStore.setLoading(true)
  try {
    // Show welcome message (don't save chat yet)
    const welcome = chatStore.getWelcomeMessage(authStore.fullName.split(' ')[0])
    chatStore.setMessages([welcome])
  } finally {
    chatStore.setLoading(false)
  }
})

// Auto-scroll when new messages arrive
watch(() => chatStore.messages.length, async () => {
  await nextTick()
  bottomEl.value?.scrollIntoView({ behavior: 'smooth' })
})

// Auto-resize textarea
function autoResize() {
  const el = textareaEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 128) + 'px'
}

function now() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || chatStore.isTyping) return

  // Check guest limit
  if (authStore.isGuest) {
    if (guestSession.isLimited()) {
      chatStore.setShowGuestLimitOverlay(true)
      return
    }
    guestSession.incrementQuestionCount()
  }

  inputText.value = ''
  if (textareaEl.value) textareaEl.value.style.height = 'auto'

  const userMsg = { role: 'user', text, time: now() }
  chatStore.addMessage(userMsg)
  
  if (authStore.uid) {
    try {
      // Create chat on first message if it doesn't exist
      if (!currentChatId.value) {
        currentChatId.value = await firestoreService.createChat(authStore.uid)
      }
      
      const saved = await firestoreService.addMessageToChat(currentChatId.value, userMsg)
      chatStore.messages[chatStore.messages.length - 1].id = saved.id
    } catch (err) {
      console.error('Failed to save user message:', err)
    }
  }

  chatStore.setTyping(true)
  await nextTick()
  bottomEl.value?.scrollIntoView({ behavior: 'smooth' })

  try {
    // TODO: replace with real AI/backend when ready
    await new Promise(r => setTimeout(r, 1400))
    
    const botMsg = {
      role: 'bot',
      text: 'Thank you for your question! I\'ve found the most relevant information from our knowledge base. Is there anything else I can help you with regarding your academic journey?',
      time: now(),
      cards: null,
    }
    
    chatStore.addMessage(botMsg)
    
    if (authStore.uid && currentChatId.value) {
      try {
        const saved = await firestoreService.addMessageToChat(currentChatId.value, botMsg)
        chatStore.messages[chatStore.messages.length - 1].id = saved.id
      } catch (err) {
        console.error('Failed to save bot message:', err)
      }
    }
    
    await nextTick()
    bottomEl.value?.scrollIntoView({ behavior: 'smooth' })
  } catch (err) {
    console.error('Error in sendMessage:', err)
  } finally {
    chatStore.setTyping(false)
  }
}

function sendQuick(text) {
  inputText.value = text
  sendMessage()
}

function handleLoginClick() {
  chatStore.setShowGuestLimitOverlay(false)
  router.push('/login')
}

function handleSignupClick() {
  chatStore.setShowGuestLimitOverlay(false)
  router.push('/register')
}
</script>