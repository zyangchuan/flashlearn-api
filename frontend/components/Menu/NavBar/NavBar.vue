<template>
  <div 
    class="
      w-20 xl:w-56 xl:h-full
      p-2 xl:p-6
      flex flex-col justify-between
      bg-primary-100 dark:bg-neutral-800
      border-2 dark:border-neutral-700 md:border-none
      shadow-none dark:shadow-none md:shadow-xl 
      rounded-3xl
      dark-transition"
  >
    <div>
      <ul>
        <li 
          class="item"
          :class="{ 'item-active': route.path.includes('dashboard') }"
          @click="navToPage('/app/dashboard')"
        >
          <HomeIcon class="item-icon" />
          <p class="item-text">Dashboard</p>
        </li>
        <li 
          class="item"
          :class="{ 'item-active': route.path.includes('decks') }"
          @click="navToPage('/app/decks')"
        >
          <RectangleStackIcon class="item-icon" />
          <p class="item-text">Decks</p>
        </li>
        <li 
          class="item"
          :class="{ 'item-active': route.path.includes('friends') }"
          @click="navToPage('/app/friends')"
        >
          <UserGroupIcon class="item-icon" />
          <p class="item-text">Friends</p>
        </li>
        <li 
          class="item"
          :class="{ 'item-active': route.path.includes('profile') }"
          @click="navToPage('/app/profile')"
        >
          <UserCircleIcon class="item-icon" />
          <p class="item-text">Profile</p>
        </li>
      </ul>
    </div>
    <div 
      class="item !p-1"
      @click="signOut"
    >
      <ArrowLeftOnRectangleIcon class="stroke-2 w-6 h-6 xl:w-5 xl:h-5 xl:mr-1 stroke-primary-900 dark:stroke-primary-dark-100" />
      <p class="item-text">Sign out</p>
    </div>
  </div>
</template>

<script setup>
import { HomeIcon, RectangleStackIcon, UserGroupIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
import { ArrowLeftOnRectangleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from "~~/stores/AuthStore"

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['close'])
const navToPage = (path) => {
  emit('close')
  router.push(path)
}

const authStore = useAuthStore()
const signOut = async () => {
  try {
    await authStore.signOut()
    authStore.$reset()
    router.push('/sign-in')
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped>
.item {
  @apply w-full h-[60px] xl:h-10 
          mb-2 p-2
          flex flex-col xl:flex-row 
          items-center justify-center xl:justify-start 
          cursor-pointer
          hover:bg-primary-200/[0.5] dark:hover:bg-primary-200/[0.1] rounded-xl;
}

.item-active {
  @apply bg-primary-200 dark:bg-primary-200/[0.2] 
    hover:bg-primary-200 dark:hover:bg-primary-200/[0.2] 
    shadow-sm dark:drop-shadow-none
    rounded-xl 
    transition ease-out duration-300;
}

.item-icon {
  @apply w-6 h-6 xl:w-5 xl:h-5 xl:mr-1 fill-primary-900 dark:fill-primary-dark-100;
}

.item-text {
  @apply text-xs xl:text-base text-primary-900 dark:text-primary-dark-100 font-medium;
}

</style>
