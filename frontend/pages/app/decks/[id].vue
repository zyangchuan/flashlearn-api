<template>
  <div>
    <div class="mx-auto md:w-full xl:w-4/5">

      <!-- Go back button -->
      <div class="flex">
        <Button2 name="Back" @click="router.go(-1)">
          <ChevronLeftIcon class="w-5 h-5 mr-1 stroke-2 stroke-secondary-500" />
        </Button2>
      </div>
      <div class="w-full flex flex-col justify-center items-center">
        <h1 class="text-2xl font-bold text-center dark:text-neutral-200">
          {{ deckStore.currentDeck.deck_name }}
        </h1>
      </div>

      <div class="mt-5 flex flex-col justify-center items-center relative">

        <CardSkeleton v-if="cardsLoading" />
        <div v-else>
          <!-- The current flashcard -->
          <DeckCard v-if="cardStore.cards.length" :card="cardStore.selectedCard" :key="cardStore.selectedCard.id" />
          <!-- No card in this deck message -->
          <DeckCard v-else :card="{ id: -1, question: 'No card in this deck', answer: '' }" />
        </div>
        
        <p class="text-neutral-400 text-center mt-4" v-if="cardStore.cards.length">
          Click to reveal the answer
        </p>

        <!-- The edit and delete buttons section -->
        <DeckLeftToolBar v-if="role === 'owner' || role === 'collaborator'"/>
      </div>

      <div v-if="!cardsLoading" class="mt-8">
        <!-- Flashcard scroll slide -->
        <DeckCardSlide :role="role" />
      </div>

      <!-- Deck name and description -->
      <div class="mt-5 p-5 rounded-lg shadow-lg">
        <div class="flex flex-col lg:flex-row justify-between items-start">
          <div class="w-full lg:w-3/4">
            <h1 class="text-lg font-bold dark:text-neutral-50">Deck name</h1>
            <div v-if="cardsLoading">
              <div class="mt-2 w-1/2 h-5 rounded-md skeleton-load"></div>
            </div>
            <p v-else class="mt-1 text-md dark:text-neutral-50">{{ deckStore.currentDeck.deck_name }}</p>
            <h1 class="mt-3 text-lg font-bold dark:text-neutral-50">Description</h1>
            <div v-if="cardsLoading">
              <div class="mt-2 w-3/4 h-5 rounded-md skeleton-load"></div>
              <div class="mt-2 w-1/2 h-5 rounded-md skeleton-load"></div>
            </div>
            <div v-else>
              <p v-if="deckStore.currentDeck.deck_description" class="mt-1 text-md dark:text-neutral-50">{{ deckStore.currentDeck.deck_description }}</p>
              <p v-else class="mt-1 text-md dark:text-neutral-50">No description is added for this deck.</p>
            </div>
          </div>

          <h1 class="lg:hidden mt-3 text-lg font-bold dark:text-neutral-50">Author</h1>
          <div class="mt-1 lg:mt-0 p-2 rounded-lg cursor-pointer shadow-lg flex flex-col lg:items-center">
            <p class="hidden lg:block text-xs text-neutral-400 font-semibold">Author</p>
            <div 
              class="mt-1 lg:mt-0 flex lg:flex-col justify-center items-center" 
              v-if="author"
              @click="router.push('/app/user/' + author.id)"
            >
              <div class="lg:mt-1 mr-2 lg:mr-0">
                <img v-if="author.picture" :src="author.picture" referrerPolicy="no-referrer" alt="@/assets/default_profile_pic.jpg" class="shadow-lg dark:shadow-none rounded-full w-11 lg:w-12">
                <img v-else src="@/assets/default_profile_pic.jpg" class="shadow-lg dark:shadow-none rounded-full w-11 lg:w-12">
              </div>
              <p class="lg:mt-1 text-xs font-semibold">{{ author.username }}</p>
            </div>
          </div>
        </div>

        <div v-if="role === 'guest' || role === 'viewer'" class="mt-10 flex justify-end">
          <Button2 v-if="role === 'guest'" name="Add to my decks" @click="addPublicDeck">
            <BookmarkIcon class="w-5 h-5 mr-1 stroke-[2.5px] stroke-secondary-500"/>
          </Button2>
          <Button2 v-if="role === 'viewer'" name="Remove from my decks" textColor="text-red-500" bgColor="hover:bg-red-100/[0.3] dark:hover:bg-red-dark-800" @click="deletePublicDeck">
            <BookmarkSlashIcon class="w-5 h-5 mr-1 stroke-[2.5px] stroke-red-500"/>
          </Button2>
        </div>
      </div>

      <!-- Deck settings -->
      <div v-if="role === 'owner' || role === 'collaborator'" class="mt-5">
        <h1 class="text-xl font-bold dark:text-neutral-50">Deck Settings</h1>
        <div class="mt-2 flex items-center">
          <p class="text-lg dark:text-neutral-100 mr-2">Share with others</p>
          <ToggleButton :trueValue="deckStore.currentDeck.public" @click="togglePublic"/>
        </div>
      </div>

      <div v-if="role === 'owner'" class="mt-12 flex items-center justify-end">
        <Button1 class="mr-2" name="Edit deck" @click="showEditDeckForm = true" />
        <Button1 name="Delete deck" class="ml-2" textColor="text-red-950" bgColor="bg-red-400" @click="showDeleteConfirm = true" />
        <Overlay v-if="showEditDeckForm">
          <DeckEditDeckForm @close="showEditDeckForm = false"/>
        </Overlay>
        <Overlay v-if="showDeleteConfirm">
          <Card>
            <p class="text-lg font-medium text-center dark:text-neutral-200">Are you sure you want to delete the deck?</p>
            <template v-slot:actions>
              <Button2 name="No, do not delete" @click="showDeleteConfirm = false"/>
              <Button2 name="Yes, delete" textColor="font-medium text-red-500" bgColor="hover:bg-red-200/[0.2]" @click="deleteDeck"/>
            </template>
          </Card>
        </Overlay>
      </div>

    </div>
  </div>
</template>

<script setup>
import CardSkeleton from "~~/components/Deck/Skeleton/CardLoading"
import { ChevronLeftIcon, TrashIcon, PencilIcon, BookmarkIcon, BookmarkSlashIcon } from "@heroicons/vue/24/outline"
import { useCardStore } from "~~/stores/CardStore"
import { useDeckStore } from "~~/stores/DeckStore"
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const deckStore = useDeckStore()
const cardStore = useCardStore()
const role = ref("guest")

const cardsLoading = ref(true)
const author = ref()
onMounted(async () => {
  try {
    await deckStore.getCurrentDeck()
    await cardStore.getAllCards(route.params.id)
    role.value = await deckStore.checkRole()

    const { data } = await axios.get(config.API_BASE_URL + "/profile/" + deckStore.currentDeck.author_user_id)
    author.value = data.user

    cardsLoading.value = false
  } catch (error) {
    console.log(error)
  }
})

const showEditDeckForm = ref(false)
const showDeleteConfirm = ref(false)

const deleteDeck = async () => {
  try {
    await deckStore.deleteDeck()
    router.push('/app/decks')
  } catch (error) {
    console.log(error)
  }
}

const addPublicDeck = async () => {
  try {
    role.value = await deckStore.addPublicDeck()
  } catch (error) {
    console.log(error)
  }
}

const deletePublicDeck = async () => {
  try {
    role.value = await deckStore.deletePublicDeck()
  } catch (error) {
    console.log(error)
  }
}

const togglePublic = async () => {
  try {
    deckStore.currentDeck.public = await deckStore.toggleDeckPublic()
  } catch (error) {
    console.log(error)
  }
}
</script>