import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const messages  = ref([
    {
      id:   1,
      role: 'bot',
      text: "Hello Manuela! I'm delighted to see you again. How can I assist you with your university journey today? I have access to your admission files and campus visit schedules.",
      time: '09:15 AM',
      cards: null,
    }
  ])
  const isTyping  = ref(false)
  const sessionId = ref('active-session-001')

  function addMessage(msg) {
    messages.value.push({ id: Date.now(), ...msg })
  }

  function setTyping(val) { isTyping.value = val }

  function clearMessages() { messages.value = [] }

  return { messages, isTyping, sessionId, addMessage, setTyping, clearMessages }
})