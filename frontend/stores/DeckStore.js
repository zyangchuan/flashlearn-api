import { defineStore } from 'pinia'
import axios from 'axios'

const config = useRuntimeConfig()
const route = useRoute()

export const useDeckStore = defineStore('deckStore', {
  state: () => ({
    decks: [],
    currentDeck: {}
  }),
  actions: {
    async getAllDecks() {
      try {
        const { data: { decks } } = await axios.get(config.API_BASE_URL + '/deck')
        this.decks = decks
      } catch (error) {
        throw error
      }
    },
    async getUserDecks(userId) {
      try {
        const { data: { decks } } = await axios.get(config.API_BASE_URL + '/deck/user/' + userId)
        this.decks = decks
      } catch (error) {
        throw error
      }
    },
    async getCurrentDeck() {
      try {
        const { data } = await axios.get(config.API_BASE_URL + '/deck/' + route.params.id)
        this.currentDeck = data
      } catch (error) {
        throw error
      }
    },
    async createDeck(deck) {
      try {
        await axios.post(config.API_BASE_URL + '/deck', deck)
      } catch (error) {
        throw error
      }
    },
    async deleteDeck() {
      try {
        await axios.delete(config.API_BASE_URL + '/deck/' + route.params.id)
        this.currentDeck = {}
      } catch (error) {
        throw error
      }
    },
    async updateDeck(deckName, deckDescription) {
      try {
        await axios.patch(config.API_BASE_URL + '/deck/' + route.params.id, { deckName: deckName, deckDescription: deckDescription })
      } catch (error) {
        throw error
      }
    },
    async toggleDeckPublic() {
      try {
        const { data } = await axios.patch(config.API_BASE_URL + '/deck/toggleDeckPublic/' + route.params.id)
        return data.public
      } catch (error) {
        throw error
      }
    },
    async checkRole() {
      try {
        const { data } = await axios.get(config.API_BASE_URL + '/deck/checkRole/' + route.params.id)
        return data.role
      } catch (error) {
        throw error
      }
    },
    async addPublicDeck() {
      try {
        const { data } = await axios.post(config.API_BASE_URL + '/deck/publicShare/' + route.params.id)
        return data.role
      } catch (error) {
        throw error
      }
    },
    async deletePublicDeck() {
      try {
        const { data } = await axios.delete(config.API_BASE_URL + '/deck/publicShare/' + route.params.id)
        return data.role
      } catch (error) {
        throw error
      }
    }
  }
})