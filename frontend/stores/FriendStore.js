import { defineStore } from 'pinia'
import axios from 'axios'

const config = useRuntimeConfig()

export const useFriendStore = defineStore('friendStore', {
  state: () => ({
    friends: [],
    foundUsers: [],
    friendRequests: [],
  }),
  actions: {
    async getAllFriends() {
      try {
        const { data: { friends } } = await axios.get(config.API_BASE_URL + '/friend')
        this.friends = friends
      } catch (error) {
        throw error
      }
    },

    async removeFriend(friendId) {
      try {
        await axios.delete(config.API_BASE_URL + '/friend/' + friendId )
      } catch (error) {
        throw error
      } 
    },

    async findFriend(username) {
      try {
        const { data: { users } } = await axios.get(config.API_BASE_URL + '/friend/search?username=' + username)
        this.foundUsers = users
      } catch (error) {
        throw error
      }
    },

    async getFriendRequests() {
      try {
        const { data: { friendRequests } } = await axios.get(config.API_BASE_URL + '/friend/request')
        this.friendRequests = friendRequests
      } catch (error) {
        throw error
      }
    },

    async acceptFriendRequest(friendId) {
      try {
        await axios.patch(config.API_BASE_URL + '/friend/request/' + friendId)
      } catch (error) {
        throw error
      }
    },

    async declineFriendRequest(friendId) {
      try {
        await axios.delete(config.API_BASE_URL + '/friend/request/' + friendId)
      } catch (error) {
        throw error
      }
    },

    async sendFriendRequest(friendId) {
      try {
        await axios.post(config.API_BASE_URL + '/friend/' + friendId)
      } catch (error) {
        throw error
      }
    }
  }
})