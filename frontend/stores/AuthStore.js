import { defineStore } from 'pinia'
import { useLocalStorage } from "@vueuse/core"
import axios from 'axios'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: useLocalStorage('user', {
      id: "",
      email: "",
      username: ""
    })
  }),
  actions: {
    async signIn(email, password) {
      const config = useRuntimeConfig()
      try {
        await axios.post(config.API_BASE_URL + '/auth/login', {
          email: email,
          password: password
        })
      } catch (error) {
        throw error
      }
    },
    async register(username, email, password) {
      const config = useRuntimeConfig()
      try {
        await axios.post(config.API_BASE_URL + '/auth/register', {
          username: username,
          email: email,
          password: password,
        })
      } catch (error) {
        throw error
      }
    },
    async changeUsername(username) {
      const config = useRuntimeConfig()
      try {
        await axios.patch(config.API_BASE_URL + '/auth/change-username', { username: username })
        this.user.username = username
      } catch (error) {
        throw error
      }
    },
    async signOut() {
      const config = useRuntimeConfig()
      try {
        await axios.delete(config.API_BASE_URL + '/auth/logout')
      } catch (error) {
        throw error
      }
    },
    async getUserInfo() {
      try {
        const config = useRuntimeConfig()
        const { data: { user } } = await axios.get(config.API_BASE_URL + '/auth/me')
        this.user = user
        return user
      } catch (error) {
        this.user = null
        navigateTo('/sign-in')
        console.log(error)
      }
    }
  }
})