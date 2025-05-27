import axios from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

interface Session {
  id: string
  startTime: string
  endTime: string
  duration: number
  distance: number
  status: string
}

interface AuthState {
  token: string | null
  isAuthenticated: boolean
}

const API_URL = import.meta.env.VITE_APP_API_URL

export const useSessionsStore = defineStore('sessions', () => {
  const sessions = ref<Session[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const auth = reactive<AuthState>({
    token: null,
    isAuthenticated: false,
  })

  async function login(username: string, password: string) {
    try {
      loading.value = true
      const { data: token } = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      })
      if (!token)
        throw new Error('Login failed, no token received')

      auth.token = token
      auth.isAuthenticated = true

      // Store token in localStorage for persistence
      localStorage.setItem('auth_token', token)

      return true
    } catch (error: any) {
      error.value = error.message || 'Authentication failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchSessions() {
    try {
      loading.value = true
      initAuth()

      // If not authenticated, try to login first
      if (!auth.isAuthenticated) {
        const loggedIn = await login(import.meta.env.VITE_APP_PINBIKE_USERNAME, import.meta.env.VITE_APP_PINBIKE_PASSWORD)
        if (!loggedIn)
          throw new Error('Authentication required')
      }

      const response = await axios.get(`${API_URL}/session/all`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })

      sessions.value = response.data
      return sessions.value
    } catch (error: any) {
      error.value = error.message || 'Failed to fetch sessions'
      throw error
    } finally {
      loading.value = false
    }
  }

  // Initialize authentication state from localStorage
  function initAuth() {
    const token = localStorage.getItem('auth_token')
    if (token) {
      auth.token = token
      auth.isAuthenticated = true
    }
  }

  return {
    sessions,
    loading,
    error,
    auth,
    login,
    fetchSessions,
    initAuth,
  }
})
