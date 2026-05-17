import { defineStore } from 'pinia'

export const useFormStore = defineStore('formStore', {
  state: () => ({
    validStates: [],
  }),
  getters: {
    formValid() {
      return this.validStates.filter(state => state.value === false).length === 0
    }
  },
  actions: {
    addValidState(state) {
      this.validStates.push(state)
    }
  }
})