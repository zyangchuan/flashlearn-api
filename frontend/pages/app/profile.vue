<template>
  <div class="w-full h-screen">
    <div class="text-2xl font-bold dark:text-neutral-200 mb-8">My Profile</div>
    <ProfileCard v-if="authStore.user" :userId="authStore.user.id" />
  </div>
</template>

<script setup>
import { useAuthStore } from "~~/stores/AuthStore"
import { useDeckStore } from "~~/stores/DeckStore"
const authStore = useAuthStore()
const deckStore = useDeckStore()

onMounted(async () => {
  try {
    await authStore.getUserInfo()
    await deckStore.getAllDecks()
  } catch (error) {
    console.log(error)
  }
})
</script>