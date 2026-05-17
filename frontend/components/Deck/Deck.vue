<template>
  <div 
    class="w-40 h-52 rounded-xl 
      bg-white dark:bg-neutral-800
      shadow-lg
      dark-transition"
  >
    <div class="p-4 w-full h-full overflow-hidden flex flex-col justify-between relative">
      <div>
        <p class="text-md font-medium w-full text-ellipsis overflow-hidden dark:text-neutral-100">
          {{ deck.deck_name }}
        </p>
        <p 
          v-if="deck.deck_description"
          class="mt-1 text-sm text-neutral-400 hover:text-neutral-400/[0.7] cursor-pointer flex items-center"
          @click="showDescription = true"
        >
          Description
          <ChevronDownIcon class="w-4 h-4 stroke-2" />
        </p>
      </div>

      <!-- Description -->
      <div 
        class="p-4 absolute z-10 -top-full left-0 w-full h-full rounded-xl bg-white dark:bg-neutral-800 flex flex-col items-center justify-between transition ease-out duration-300"
        :class="{ 'translate-y-full': showDescription }"
        ref="target"
      >
        <div class="w-full">
          <p class="text-sm dark:text-neutral-200">{{ deck.deck_description }}</p>
        </div>

        <ChevronUpIcon 
          class="w-7 h-7 stroke-2 stroke-secondary-300 hover:stroke-secondary-200 cursor-pointer" 
          @click="showDescription = false"
        />
      </div>

      <!-- Buttons -->
      <div class="flex flex-col">
        <div v-if="author && author.id !== authStore.user.id" class="mb-4 flex items-center">
          <p class="text-xs mt-1 text-neutral-400 mr-2">Created by</p>
          <Tooltip v-if="author" :label="author.username">
            <div>
              <img v-if="author.picture"  :src="author.picture" referrerPolicy="no-referrer" alt="@/assets/default_profile_pic.jpg" class="shadow-lg dark:shadow-none rounded-full w-6">
              <img v-else src="@/assets/default_profile_pic.jpg" class="shadow-lg dark:shadow-none rounded-full w-6">
            </div>
          </Tooltip>
        </div>
        <div class="flex">
          <Tooltip label="Study">
            <div class="circleButton" @click="openGameModesMenu" @mouseenter="showStudyToolTip = true" @mouseleave="showStudyToolTip = false">
              <PlayIcon class="w-full h-full fill-primary-900" />
            </div>
          </Tooltip>

          <Tooltip class="ml-2" label="Edit">
            <div class="circleButton" @click="router.push('/app/decks/' + deck.id)" @mouseenter="showEditToolTip = true" @mouseleave="showEditToolTip = false">
              <PencilIcon class="w-full h-full fill-primary-900" />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>

    <Overlay v-if="showGameModes">
      <Card>
        <p class="text-xl font-bold text-center dark:text-neutral-200">Choose a game mode</p>
        <template v-slot:main>
          <div class="flex flex-col items-center gap-3">
            <div 
              class="w-64 h-12 p-3 study-gradient shadow-md hover:scale-105 rounded-xl flex justify-between items-center cursor-pointer" 
              @click="studyDeck"
            >
              <div class="h-full flex items-center">
                <AcademicCapIcon class="h-full fill-white" />
                <p class="ml-2 font-medium text-white">Study</p>
              </div>
              <div class="h-full flex items-center">
                <ProgressCircle :percent="completedCardsCount / cardSetSize" width="26px" height="26px" circleColor="stroke-secondary-300" strokeColor="stroke-secondary-100" strokeWidth="16px"/>
                <div class="ml-1 text-xs font-medium text-center text-white">
                  <p>
                    {{ completedCardsCount }}/{{ cardSetSize }} 
                  </p>
                  <p class="-mt-[2px]">studied</p>
                </div>
              </div>
            </div>

            <div 
              class="w-64 h-12 p-3 blitz-gradient shadow-md hover:scale-105 rounded-xl flex justify-between cursor-pointer"
              @click="playBlitz()"
            >
              <div class="h-full flex items-center">
                <BoltIcon class="h-full fill-white" />
                <p class="ml-2 font-medium text-white">Blitz</p>
              </div>
              <div class="h-full flex items-center">
                <RocketLaunchIcon class="h-3 fill-white" />
                <p class="ml-1 text-xs text-white font-medium">Earn EXP</p>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:actions>
          <Button2 name="Close" @click="showGameModes = false"/>
        </template>
      </Card>
    </Overlay>
    <Overlay v-if="showNoCardsMessage">
      <Card>
        <p class="text-lg font-medium text-center dark:text-neutral-200">There is no cards in this deck.</p>
        <template v-slot:actions>
          <Button2 name="Close" @click="showNoCardsMessage = false"/>
          <Button2 name="Create cards" @click="router.push('/app/decks/' + deck.id)"/>
        </template>
      </Card>
    </Overlay>

    <Overlay v-if="showDeckSizeTooSmallMessage">
      <Card>
        <p class="text-lg font-medium text-center dark:text-neutral-200">In order to play Blitz mode for this deck, there must be at least be at least 20 cards in this deck.</p>
        <template v-slot:actions>
          <Button2 name="Close" @click="showDeckSizeTooSmallMessage = false"/>
          <Button2 name="Create cards" @click="router.push('/app/decks/edit-deck/' + deck.id)"/>
        </template>
      </Card>
    </Overlay>
  </div>
</template>

<script setup>
import axios from 'axios'
import { PlayIcon, PencilIcon, AcademicCapIcon, BoltIcon, RocketLaunchIcon } from "@heroicons/vue/24/solid"
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/24/outline"
import { onClickOutside } from '@vueuse/core'
import { useCardStore } from "~~/stores/CardStore"
import { useStudyStore } from "~~/stores/StudyStore"
import { useAuthStore } from "~~/stores/AuthStore"
import { storeToRefs } from "pinia"

const props = defineProps(['deck'])
const router = useRouter()
const config = useRuntimeConfig()

const showDescription = ref(false)

const showNoCardsMessage = ref(false)
const showDeckSizeTooSmallMessage = ref(false)
const showGameModes = ref(false)
const cardStore = useCardStore();
const studyStore = useStudyStore();
const authStore = useAuthStore();

const { completedCardsCount, cardSetSize } = storeToRefs(studyStore);

const openGameModesMenu = (async () => {
  try {
    await cardStore.getAllCards(props.deck.id)
    if (!cardStore.cards.length) {
      showNoCardsMessage.value = true
    } else {
      await studyStore.getStudyCardSetProgress(props.deck.id)
      showGameModes.value = true
    }
  } catch (error) {
    console.log(error)
  }
})

const studyDeck = (async () => {
  if (studyStore.card === null || completedCardsCount.value === cardSetSize.value) {
    await studyStore.getStudyCard(props.deck.id)
    await studyStore.getStudyCardSetProgress(props.deck.id)
  }
  router.push('/app/decks/study/' + props.deck.id)
})

const playBlitz = async () => {
  try {
    await axios.get(config.API_BASE_URL + '/blitz/' + props.deck.id)
    router.push('/app/decks/blitz/' + props.deck.id)
  } catch (error) {
    console.log(error)
    if (error.response.data.msg === 'deck_size_small') {
      showDeckSizeTooSmallMessage.value = true
    }
  }
}

const author = ref()
onMounted(async () => {
  try {
    const { data } = await axios.get(config.API_BASE_URL + "/profile/" + props.deck.author_user_id)
    author.value = data.user
  } catch (error) {
    console.log(error)
  }
})

const target = ref()
onClickOutside(target, () => showDescription.value = false)
</script>

<style scoped>
.circleButton {
  @apply w-7 h-7 p-[7px] rounded-full 
    bg-primary-200 dark:bg-primary-dark-100
    cursor-pointer
    flex justify-center items-center;
}

.study-gradient {
  background-image: linear-gradient(62deg, #60a5fa 0%, #7dd3fc 100%);
  background-size: 200% auto;
  transition: 200ms ease-in-out;
}

.study-gradient:hover {
  background-position: top center;
}

.blitz-gradient {
  background-image: linear-gradient(90deg, #e78bfe 0%, #63edff 100%);
  background-size: 200% auto;
  transition: 200ms ease-in-out;
}

.blitz-gradient:hover {
  background-position: top center;
}


</style>

