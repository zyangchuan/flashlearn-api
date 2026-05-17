import { defineStore } from 'pinia'
import axios from 'axios'

const config = useRuntimeConfig()

export const useStudyStore = defineStore('studyStore', {
  state: () => ({
    card: null,
    completedCardsCount: 0,
    cardSetSize: 0
  }),
  actions: {
    async getStudyCard(deckId) {
      try {
        const { data: { card } } = await axios.get(config.API_BASE_URL + '/study/' + deckId)
        this.card = JSON.parse(card)
      } catch (error) {
        throw error
      }
    },
    async getStudyCardSetProgress(deckId) {
      try {
        const { data } = await axios.get(config.API_BASE_URL + '/study/progress/' + deckId)
        this.completedCardsCount = data.completedCardsCount;
        this.cardSetSize = data.cardSetSize
      } catch (error) {
        throw error
      }
    },
    async updateCard(deckId, familiarity) {
      try {
        await axios.patch(config.API_BASE_URL + '/study/' + deckId, { familiarity: familiarity })
      } catch (error) {
        throw error
      }
    }
  }
})