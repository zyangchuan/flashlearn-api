<template>
  <div>
    <h1 class="text-2xl font-bold dark:text-neutral-200">Friends</h1>
    <!-- Top options -->
    <div class="mt-2 mb-5 flex flex-col lg:flex-row lg:items-center justify-between">
      <div class="flex gap-2">
        <!-- Add friend button and form -->
        <Button2 name="Add Friends" @click="showAddFriendForm=true">
          <PlusCircleIcon class="w-5 h-5 mr-1 fill-secondary-500"/>
        </Button2>
        <Overlay v-if="showAddFriendForm" >
          <AddFriendForm  @close="showAddFriendForm = false"/>
        </Overlay>

        <!-- Friend requests button and form -->
        <Button2 name="Requests" @click="showFriendRequestForm=true">
          <UserCircleIcon class="w-5 h-5 mr-1 fill-secondary-500"/>
        </Button2>
        <Overlay v-if="showFriendRequestForm" >
          <FriendRequestForm @close="showFriendRequestForm = false"/>
        </Overlay>

        <div v-if="!editing">
          <Button2 name="Edit" text-color="text-yellow-500" @click="editing = !editing">
            <PencilIcon class="w-5 h-5 mr-1 fill-yellow-500"/>
          </Button2>
        </div>

        <div v-else>
          <Button2 name="Stop Editing" text-color="text-yellow-500" @click="editing = !editing">
            <PencilIcon class="w-5 h-5 mr-1 fill-yellow-500"/>
          </Button2>
        </div>
      </div>

      <SearchBar v-model="search" placeholder="Search friends" class="mt-2 lg:mt-0 max-w-72"/>
    </div>

    <div v-if="loading" class="w-full h-[300px] flex flex-col justify-center items-center">
      <Spinner class="w-20 h-20 fill-primary-200" />
    </div>

    <div v-else>
      <Friend 
        v-for="friend in friends" :key="friend.id" 
        :friend="friend"
        :editing="editing"
        @deleted="editing = false"
      />
      <div class="w-full h-72 flex flex-col justify-center" v-if="friends.length === 0 && !search.length">
        <p class="text-lg text-center text-gray-400">You have no currently friends added.</p>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { useAuthStore } from "~~/stores/AuthStore"
import { useFriendStore } from "~~/stores/FriendStore"
import { PlusCircleIcon, UserCircleIcon, PencilIcon } from "@heroicons/vue/24/solid"
import Friend from "~~/components/Friend/Friend.vue"
import AddFriendForm from "~~/components/Friend/AddFriendForm.vue"
import FriendRequestForm from "~~/components/Friend/FriendRequestForm.vue"
import { onClickOutside } from "@vueuse/core"

const friendStore = useFriendStore()

const showAddFriendForm = ref(false)
const showFriendRequestForm = ref(false)

const authStore = useAuthStore()

const loading = ref(false)
onMounted(async () => {
  try {
    loading.value = true
    await authStore.getUserInfo()
    await friendStore.getAllFriends()
    loading.value = false
  } catch (error) {
    console.log(error)
  }
})

const search = ref("")
const friends = computed(() => {
  return friendStore.friends.filter(friend => friend.username.toLowerCase().includes(search.value.toLowerCase()))
})

const editing = ref(false)

</script>