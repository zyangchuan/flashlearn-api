<template>
  <div class="w-screen max-w-[720px] p-8 rounded-xl bg-white dark:bg-neutral-900 moveUp">
    <h1 class="mb-4 text-2xl font-bold dark:text-neutral-200">Friend requests</h1>
    <SearchBar placeholder="Search Requests" class=" max-w-[250px]"/>
    <div class="w-full h-[300px]">
      <div v-if="friendStore.friendRequests.length > 0" class="w-full h-full overflow-scroll slide">
        <User 
          v-for="friend in friendStore.friendRequests" :key="friend.id" 
          :friend="friend"
        />
      </div>
      <div v-else class="w-full h-full flex flex-col justify-center">
        <p class="mt-2 text-lg text-center text-gray-400">You currently have no friend requests</p>
      </div>
    </div>
      
    <div class="flex items-center justify-end mt-2">
      <Button2 name="Cancel" @click="emit('close')"/>
    </div>
  </div>
</template>

<script setup>
import { maxLength, required } from "~~/composables/validator"
import { useFriendStore } from "~~/stores/FriendStore"
import User from "~~/components/Friend/User.vue"

const friendStore = useFriendStore()

const emit = defineEmits(['close'])
const search = ref('')

onMounted(async () => {
  try {
    await friendStore.getFriendRequests()
  } catch (error) {
    console.log(error)
  }
})

</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.slide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.slide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.moveUp {
  animation: moveUp 200ms ease-out forwards;
}

@keyframes moveUp {
  from {
    transform: translateY(100px)
  }
  to {
    transform: translateY(0)
  }
}
</style>