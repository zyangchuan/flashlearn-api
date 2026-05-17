<template>
  <div>
    <h1 class="text-2xl font-bold dark:text-neutral-200">Dashboard</h1>
    <p class="text-xl font-semibold mt-5">Welcome {{ authStore.user.username }}</p>
  </div>
</template>

<script setup>
import { useAuthStore } from "~~/stores/AuthStore"
const authStore = useAuthStore()

onMounted(async () => {
  try {
    await authStore.getUserInfo()
  } catch (error) {
    console.log(error)
  }
})
</script>