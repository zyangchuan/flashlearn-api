<template>
  <div class="w-full p-3 my-2 rounded-xl border-2 border-secondary-100 dark:border-secondary-dark-600 bg-white dark:bg-neutral-800">
    <slot/>
    <div class="flex items-center justify-between">
      <div class="flex items-center cursor-pointer" @click="goToProfile">
        <div v-if="friend">
          <img v-if="friend.picture"  :src="friend.picture" referrerPolicy="no-referrer" alt="@/assets/default_profile_pic.jpg" class="shadow-lg dark:shadow-none rounded-full w-11 mr-3">
          <img v-else src="@/assets/default_profile_pic.jpg" class="shadow-lg dark:shadow-none rounded-full w-11 mr-3">
        </div>
        <div class="font-bold dark:text-neutral-100">
          {{ friend.username }}
        </div>
      </div>

      <div class="flex">
        <div>
          <Button2 name="Profile" @click="goToProfile">
            <UserIcon class="w-4 h-4 mr-1 fill-secondary-500"/>
          </Button2>
        </div>

        <div v-if="editing">
          <Button2 name="Remove" @click="showDeleteConfirm=true" textColor="text-red-500">
            <MinusCircleIcon class="w-5 h-5 mr-1 fill-red-500"/>
          </Button2>
        </div>
      </div>

      <Overlay v-if="showDeleteConfirm">
        <Card>
          <p class="text-lg font-medium text-center dark:text-neutral-200">Are you sure you want to remove this friend?</p>
          <template v-slot:actions>
            <Button2 name="No, do not remove" @click="showDeleteConfirm = false"/>
            <Button2 name="Yes, remove" textColor="font-medium text-red-500" bgColor="hover:bg-red-200/[0.2]" @click="removeFriend()" />
          </template>
        </Card>
      </Overlay>
      
    </div>
  </div>
</template>

<script setup>
import { MinusCircleIcon, PlusCircleIcon, CheckCircleIcon, UserIcon } from "@heroicons/vue/24/solid"
import { useFriendStore } from "~~/stores/FriendStore"

const props = defineProps(['friend', 'editing'])
const friendStore = useFriendStore()

const emit = defineEmits(['deleted'])

const showDeleteConfirm = ref(false)
const removeFriend = async () => {
  try{
    await friendStore.removeFriend(props.friend.id)
    emit('deleted')
    await friendStore.getAllFriends()
  } catch(error){
    console.log(error)
  }
}

const router = useRouter()
const goToProfile = () => {
  router.push('/app/user/' + props.friend.id)
}
</script>
