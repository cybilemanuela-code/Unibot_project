import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase'

const userDoc   = (uid) => doc(db, 'users', uid)
const messagesCol = (uid) => collection(db, 'users', uid, 'messages')

const DEFAULT_NOTIF_PREFS = {
  chat:     true,
  academic: true,
  partner:  false,
}

function splitName(name = '') {
  const parts = name.trim().split(/\s+/)
  return {
    firstName: parts[0] || '',
    lastName:  parts.slice(1).join(' '),
  }
}

function mapProfileData(data = {}) {
  const name = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim()
  const { firstName, lastName } = splitName(name)
  return {
    name:        name || 'User',
    firstName:   data.firstName || firstName,
    lastName:    data.lastName  || lastName,
    email:       data.email     || '',
    role:        data.role      || 'student',
    avatar:      data.avatar    || null,
    phone:       data.phone     || '',
    studentId:   data.studentId || '',
    notifPrefs:  data.notifPrefs || DEFAULT_NOTIF_PREFS,
  }
}

export const firestoreService = {
  async createUserProfile(uid, data) {
    const profile = {
      ...mapProfileData(data),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    await setDoc(userDoc(uid), profile)
    return profile
  },

  async ensureUserProfile(uid, data) {
    const snap = await getDoc(userDoc(uid))
    if (snap.exists()) return mapProfileData(snap.data())
    return this.createUserProfile(uid, data)
  },

  async getUserProfile(uid) {
    const snap = await getDoc(userDoc(uid))
    if (!snap.exists()) return mapProfileData({})
    return mapProfileData(snap.data())
  },

  async updateUserProfile(uid, updates) {
    const payload = { ...updates, updatedAt: serverTimestamp() }
    if (updates.name) {
      const { firstName, lastName } = splitName(updates.name)
      payload.firstName = firstName
      payload.lastName  = lastName
    }
    await updateDoc(userDoc(uid), payload)
    return this.getUserProfile(uid)
  },

  async saveNotificationPrefs(uid, notifPrefs) {
    await updateDoc(userDoc(uid), { notifPrefs, updatedAt: serverTimestamp() })
  },

  async addMessage(uid, message) {
    const ref = await addDoc(messagesCol(uid), {
      role:      message.role,
      text:      message.text,
      time:      message.time,
      cards:     message.cards ?? null,
      createdAt: serverTimestamp(),
    })
    return { id: ref.id, ...message }
  },

  async getMessages(uid, max = 50) {
    const q = query(messagesCol(uid), orderBy('createdAt', 'asc'), limit(max))
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        id:    d.id,
        role:  data.role,
        text:  data.text,
        time:  data.time,
        cards: data.cards ?? null,
      }
    })
  },
}
