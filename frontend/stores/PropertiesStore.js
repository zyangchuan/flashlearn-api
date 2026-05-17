import { defineStore } from 'pinia'

export const usePropertiesStore = defineStore('propertiesStore', {
  state: () => ({
    darkMode: false,
    showNavBar: false
  }),
  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
    },
    toggleNavBar() {
      this.showNavBar = !this.showNavBar
    }
  }
})