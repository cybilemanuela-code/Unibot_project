import { defineStore } from 'pinia'
import { ref } from 'vue'

const WELCOME_MESSAGE = (name) => ({
  role: 'bot',
  text: name
    ? `Hello ${name}! I'm delighted to see you again. How can I assist you with your university journey today?`
    : "Hello! I'm delighted to see you again. How can I assist you with your university journey today?",
  time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  cards: null,
})

export const useChatStore = defineStore('chat', () => {
  const messages  = ref([])
  const isTyping  = ref(false)
  const isLoading = ref(false)

  function setMessages(list) {
    messages.value = list
  }

  function addMessage(msg) {
    messages.value.push(msg)
  }

  function setTyping(val) { isTyping.value = val }
  function setLoading(val) { isLoading.value = val }

  function clearMessages() { messages.value = [] }

  function getWelcomeMessage(name) {
    return { id: 'welcome', ...WELCOME_MESSAGE(name) }
  }

  return {
    messages, isTyping, isLoading,
    setMessages, addMessage, setTyping, setLoading, clearMessages, getWelcomeMessage,
  }
})
