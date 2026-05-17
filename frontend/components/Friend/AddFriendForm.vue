<template>
  <div class="w-screen max-w-[720px] p-8 rounded-xl bg-white dark:bg-neutral-900 moveUp">
    <div class="h-full flex-col">
      <h1 class="mb-4 text-2xl font-bold dark:text-neutral-200">Add a new friend</h1>
      <SearchBar v-model="search" placeholder="Search User" class="w-full"/>
      <div class="w-full h-[300px]">
        <div v-if="loading" class="w-full h-full flex flex-col justify-center items-center">
          <Spinner class="w-12 h-12 fill-primary-200" />
        </div>
        <div v-else class="h-full overflow-scroll slide">
          <User 
            v-for="friend in friendStore.foundUsers" :key="friend.id" 
            :friend="friend"
          />
        </div>
      </div>
      <div class="flex items-center justify-end mt-2">
        <Button2 name="Cancel" @click="closeForm"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { maxLength, required } from "~~/composables/validator"
import { useFriendStore } from "~~/stores/FriendStore"
import User from "~~/components/Friend/User.vue"

const friendStore = useFriendStore()

const emit = defineEmits(['close'])
const search = ref("")

const loading = ref(false)
function debounce(func) {
  let timer;
  return () => {
    clearTimeout(timer)
    loading.value = true
    timer = setTimeout(func, 500)
  }
}

const closeForm = () => {
  friendStore.foundUsers = []
  emit('close')
}

watch(search, debounce(async () => { 
  await friendStore.findFriend(search.value)
  loading.value = false
}))

onMounted(async () => {
  friendStore.foundUsers = []
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