<template>
  <div>
    <!-- Go back button -->
    <div class="mb-2 flex">
      <Button2 name="Back" @click="router.go(-1)">
        <ChevronLeftIcon class="w-5 h-5 mr-1 stroke-2 stroke-secondary-500" />
      </Button2>
    </div>
    <h1 class="mb-8 text-2xl font-bold dark:text-neutral-200">User's Profile</h1>
    <ProfileCard :userId="route.params.id"/>
  </div>
</template>

<script setup>
import { ChevronLeftIcon } from "@heroicons/vue/24/outline"
const route = useRoute()
const router = useRouter()
</script>