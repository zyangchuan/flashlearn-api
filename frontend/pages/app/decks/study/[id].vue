<template>
  <div>
    <div class="mx-auto md:w-full xl:w-4/5">

      <!-- Go back button -->
      <div class="flex">
        <Button2 name="Back" @click="router.go(-1)">
          <ChevronLeftIcon class="w-5 h-5 mr-1 stroke-2 stroke-secondary-500" />
        </Button2>
      </div>
      
      <div class="mt-10 lg:relative">
        <div class="mb-5 lg:mb-0 lg:absolute">
          <div class="flex flex-col justify-center items-center">
            <p class="mb-2 font-medium text-primary-950 dark:text-primary-dark-100 text-center">Card set</p>
            <div v-if="cardLoading" class="w-[80px] h-[80px] border-4 border-neutral-200 dark:border-neutral-700 rounded-full animate-pulse"></div>
            <ProgressCircle v-else :percent="percent" :text="text" width="90px" height="90px" />
          </div>
        </div>
        <div class="w-full h-10 flex justify-center items-center">
          <h1 class="text-2xl font-bold text-center dark:text-neutral-200">
            {{ deckStore.currentDeck.deck_name }}
          </h1>
        </div>

        <div class="mt-5 flex flex-col justify-center items-center relative">
          <CardSkeleton v-if="cardLoading" />
          <DeckCard v-else :card="card" :key="card.id"/>
          
          <p class="text-neutral-400 text-center mt-4">
            Click to reveal the answer
          </p>

          <div class="mt-5 flex gap-8">
            <Button2 name="Not familiar" textColor="text-red-500" bgColor="hover:bg-red-200/[0.2]" @click="updateCard(0)"/>
            <Button2 name="Not sure" textColor="text-amber-500" bgColor="hover:bg-amber-200/[0.2]" @click="updateCard(1)"/>
            <Button2 name="Familiar" textColor="text-emerald-500" bgColor="hover:bg-emerald-200/[0.2]" @click="updateCard(2)"/>
          </div>
        </div>
      </div>
    </div>
    <Overlay v-if="showNextCardSetPrompt">
      <Card>
        <p class="text-2xl font-bold text-center dark:text-neutral-200">Congratulations!</p>
        <p class="mt-2 text-lg font-medium text-center text-neutral-400 dark:text-neutral-500">You have completed this card set.</p>
        <p class="mt-4 text-lg font-medium text-center dark:text-neutral-200">Do you want to continue to study the next card set?</p>
        <template v-slot:actions>
          <Button2 name="No" textColor="text-red-500" bgColor="hover:bg-red-200/[0.2]" @click="showNextCardSetPrompt = false; router.push('/app/decks')"/>
          <Button2 name="Yes, continue" @click="studyNextSet"/>
        </template>
      </Card>
    </Overlay>
  </div>
</template>

<script setup>
import CardSkeleton from "~~/components/Deck/Skeleton/CardLoading"
import { ChevronLeftIcon } from "@heroicons/vue/24/outline"
import { useDeckStore } from "~~/stores/DeckStore"
import { useStudyStore } from "~~/stores/StudyStore"
import { storeToRefs } from "pinia"

const router = useRouter()
const route = useRoute()
const deckId = route.params.id

const deckStore = useDeckStore()
const studyStore = useStudyStore()
const { card, completedCardsCount, cardSetSize } = storeToRefs(studyStore)

const cardLoading = ref(true)
onMounted(async () => {
  try {
    await deckStore.getCurrentDeck()
    cardLoading.value = false
  } catch (error) {
    console.log(error)
  }
})

const percent = computed(() => completedCardsCount.value / cardSetSize.value)
const text = computed(() => completedCardsCount.value + '/' + cardSetSize.value)

const showNextCardSetPrompt = ref(false)

const updateCard = async (familiarity) => {
  try {
    await studyStore.updateCard(deckId, familiarity)
    await studyStore.getStudyCardSetProgress(deckId)

    // Checks if the user has completed the set
    if (completedCardsCount.value === cardSetSize.value) {
      showNextCardSetPrompt.value = true
    } else {
      await studyStore.getStudyCard(deckId)
    }
  } catch (error) {
    console.log(error)
  }
}

const studyNextSet = async () => {
  try {
    await studyStore.getStudyCard(deckId)
    await studyStore.getStudyCardSetProgress(deckId)
    showNextCardSetPrompt.value = false
  } catch (error) {
    console.log(error)
  }
}
</script>