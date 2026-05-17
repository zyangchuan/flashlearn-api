import { defineStore } from 'pinia'
import axios from 'axios'

const config = useRuntimeConfig()
const route = useRoute()

export const useCardStore = defineStore('cardStore', {
  state: () => ({
    cards: [],
    selectedCard: { id: -1, question: 'No card in this deck', answer: '' }
  }),
  actions: {
    async getAllCards(deckId) {
      try {
        const { data: { cards } } = await axios.get(config.API_BASE_URL + '/card/' + deckId)
        this.cards = cards
        this.updateSelectedCard(cards[0])
      } catch (error) {
        throw error
      }
    },
    async createCard(card) {
      try {
        await axios.post(config.API_BASE_URL + '/card/' + route.params.id, card)
      } catch (error) {
        throw error
      }
    },
    async deleteCard() {
      try {
        await axios.delete(config.API_BASE_URL + '/card/' + route.params.id + '/' + this.selectedCard.id )
      } catch (error) {
        throw error
      }
      this.cards = this.cards.filter(card => card.id != this.selectedCard.id)
    },
    async batchDeleteCards(cards) {
      try {
        await axios.delete(config.API_BASE_URL + '/card/' + route.params.id, { data: { cards: cards } })
      } catch (error) {
        throw error
      }
    },
    updateSelectedCard(card) {
      this.selectedCard = card
    },
    async updateCard(question, answer) {
      try {
        await axios.patch(config.API_BASE_URL + '/card/' + route.params.id, { id: this.selectedCard.id, question: question, answer: answer })
        this.selectedCard.question = question
        this.selectedCard.answer = answer
      } catch (error) {
        throw error
      }
    }
  }
})