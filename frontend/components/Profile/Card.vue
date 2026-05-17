<template>
  <div>
    <div class="w-full xl:w-[700px] rounded-lg shadow-lg dark:shadow-none dark:bg-neutral-800 overflow-clip">
      <div class="-mb-[50px] w-full h-32 bg-primary-200"></div>
      <div class="p-4 w-full h-full">
        <div class="w-full flex items-center">
          <div v-if="user">
            <img v-if="user.picture" :src="user.picture" referrerPolicy="no-referrer" class="shadow-lg dark:shadow-none rounded-full w-20">
            <img v-else src="@/assets/default_profile_pic.jpg" alt="" class="shadow-lg dark:shadow-none rounded-full w-20">
          </div>
          <div class="ml-3 flex items-center">
            <div class="flex flex-col">
              <div v-if="user" class="flex items-center -mt-10">
                <div class="flex justify-center text-lg text-primary-900 font-semibold">
                  {{ user.username }}
                </div>
                <Button2 v-if="props.userId === authStore.user.id" class="mr-2" name="Edit" @click="showChangeUsernameForm = true">
                  <PencilIcon class="w-3 h-3 mr-1 fill-secondary-500" />
                </Button2>
              </div>

              <div v-else>Loading</div>
              <!-- <p class="mt-2 text-sm font-medium dark:text-neutral-100">Level 1</p>
              <div class="mt-2 w-48 h-2 rounded-full bg-secondary-100 dark:bg-secondary-dark-600"></div>
              <div class="text-xs text-neutral-400 flex justify-between">
                <p><span class="font-medium text-secondary-300 dark:text-secondary-dark-300">100 XP</span> until Level 2</p>
                <p class="font-medium text-secondary-300 dark:text-secondary-dark-300">0 XP</p>
              </div> -->
            </div>
          </div>
        </div>

        <Overlay v-if="showChangeUsernameForm">
          <Card>
            <template v-slot:header>
              <h1 class="text-2xl font-bold dark:text-neutral-200">Change username</h1>
            </template>

            <template v-slot:main>
              <Form ref="changeUsernameForm">
                <div>
                  <p class="mb-2 text-lg font-medium dark:text-neutral-200">Username</p>
                  <FormTextField 
                    v-model="newUsername" 
                    :validator="[required, maxLength(20)]"
                  />
                </div>
              </Form>
            </template>

            <template v-slot:actions>
              <Button2 name="Cancel" @click="showChangeUsernameForm = false"/>
              <Button2 name="Done" @click="changeUsername"/>
            </template>
          </Card>
        </Overlay>

        <!-- Details of profile  -->
        <div class="mt-5 p-4 rounded-lg bg-primary-50 dark:bg-primary-50/[0.1]">
          <p class="mb-2 text-lg font-bold text-primary-900 dark:text-primary-dark-100">Decks</p>
          <div v-if="deckStore.decks.length" class="flex flex-wrap gap-3 md:gap-5">
            <div 
              class="p-3 w-32 h-40 rounded-xl cursor-pointer bg-white dark:bg-neutral-800 shadow-lg dark-transition"
              v-for="deck in deckStore.decks" :key="deck.id" 
              :deck="deck"
              @click="router.push('/app/decks/' + deck.id)"
            >
              <p class="text-sm font-medium w-full text-ellipsis overflow-hidden dark:text-neutral-100">{{ deck.deck_name }}</p>
            </div>
          </div>
          <div v-else>
            <p class="text-primary-dark-100">This user has not shared any decks</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DeckSkeleton from "~~/components/Deck/Skeleton/DeckLoading"
import Button2 from "~~/components/Button2.vue"
import { PencilIcon } from "@heroicons/vue/24/solid"
import { useDeckStore } from "~~/stores/DeckStore"
import { useAuthStore } from "~~/stores/AuthStore"
import axios from 'axios'

const props = defineProps(['userId'])
const config = useRuntimeConfig()

const deckStore = useDeckStore()
const authStore = useAuthStore()
const router = useRouter()

const user = ref()

onMounted(async () => {
  try {
    const { data } = await axios.get(config.API_BASE_URL + "/profile/" + props.userId)
    user.value = data.user
    await deckStore.getUserDecks(props.userId)
  } catch (error) {
    console.log(error)
  }
})

const showChangeUsernameForm = ref(false)
const changeUsernameForm = ref()
const newUsername = ref(authStore.user.username)
const changeUsername = async () => {
  try {
    await authStore.changeUsername(newUsername.value)
    showChangeUsernameForm.value = false
  } catch (error) {
    console.log(error)
  }
}
</script>