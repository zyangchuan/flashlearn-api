<template>
  <div 
    class="w-full p-3 my-2 rounded-xl border-2 border-secondary-50 dark:border-secondary-dark-600 bg-white dark:bg-neutral-900"
  >
    <slot/>
    <div class="flex items-center justify-between">
      <div class="flex items-center cursor-pointer" @click="goToProfile">
        <div v-if="friend">
          <img v-if="friend.picture" :src="friend.picture" referrerPolicy="no-referrer" alt="" class="shadow-lg dark:shadow-none rounded-full w-11 mr-3">
          <img v-else src="@/assets/default_profile_pic.jpg" alt="" class="shadow-lg dark:shadow-none rounded-full w-11 mr-3">
        </div>
        
        <div class="font-bold dark:text-neutral-100">
          {{ friend.username }}
        </div>
      </div>

      <div v-if="friend.status === 'not_friend' && !requestSent">
        <Button2 name="Send request" @click="sendFriendRequest()">
          <PlusCircleIcon class="w-5 h-5 mr-1 fill-secondary-500"/>
        </Button2>
      </div>

      <div v-else-if="requestSent || friend.status === 'requested'" class="flex align-center mr-3">
        <CheckCircleIcon class="w-5 h-5 mr-1 fill-emerald-300"/>
        <p class="text-emerald-300">Request sent</p>
      </div>

      <div v-else-if="friend.status !== 'friend'" class="flex">
        <div @click="acceptFriendRequest()">
          <Button2 name="Accept">
            <PlusCircleIcon class="w-5 h-5 mr-1 fill-secondary-500"/>
          </Button2>  
        </div>

        <div @click="declineFriendRequest()">
          <Button2 textColor="font-medium text-red-500" bgColor="hover:bg-red-200/[0.2]" name="Decline">
            <MinusCircleIcon class="w-5 h-5 mr-1 fill-red-500"/>
          </Button2>  
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MinusCircleIcon, PlusCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/solid"
import { useFriendStore } from "~~/stores/FriendStore"

const friendStore = useFriendStore()
const props = defineProps(['friend'])

const acceptFriendRequest = async () => {
  try{
    await friendStore.acceptFriendRequest(props.friend.id)
    await friendStore.getFriendRequests()
    await friendStore.getAllFriends()
  } catch (error) {
    console.log(error)
  }
}

const declineFriendRequest = async () => {
  try{
    await friendStore.declineFriendRequest(props.friend.id)
    await friendStore.getFriendRequests()
    await friendStore.getAllFriends()
  } catch (error) {
    console.log(error)
  }
}

const requestSent = ref(false)
const sendFriendRequest = async () => {
  try{
    await friendStore.sendFriendRequest(props.friend.id)
    requestSent.value = true
  } catch (error) {
    console.log(error)
  }
}

const router = useRouter()
const goToProfile = () => {
  router.push('/app/user/' + props.friend.id)
}
</script>