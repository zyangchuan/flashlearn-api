<template>
  <div>
    <div class="mt-5 w-full flex justify-between items-center">

      <!-- Search bar -->
      <SearchBar v-if="cardStore.cards.length" v-model="search" placeholder="Search card" class="w-full max-w-xs mx-auto"/>

      <Overlay v-if="showCreateCardForm">
        <DeckCreateCardForm @close="showCreateCardForm = false"/>
      </Overlay>
      <Overlay v-if="showDeleteConfirm">
        <Card>
          <p class="text-lg font-medium text-center dark:text-neutral-200">Are you sure you want to delete the selected cards?</p>
          <template v-slot:actions>
            <Button2 name="No, do not delete" @click="showDeleteConfirm = false"/>
            <Button2 name="Yes, delete" textColor="font-medium text-red-500" bgColor="hover:bg-red-200/[0.2]" @click="deleteCards"/>
          </template>
        </Card>
      </Overlay>
    </div>

    <!-- Flashcard scroll slide -->
    <div class="w-full flex justify-between items-center" v-if="cardStore.cards.length">
      <!-- Left arrow -->
      <div 
        class="md:p-2 rounded-full md:hover:bg-secondary-50 md:dark:hover:bg-secondary-dark-800 cursor-pointer"
        @click="x-=300"
      >
        <ChevronLeftIcon class="w-6 h-6 md:w-8 md:h-8 stroke-2 stroke-secondary-500"/>
      </div>

      <div ref="el" class="slide md:mx-5 flex overflow-x-scroll">
        <div class="relative" v-for="card in cards" :key="card.id" >
          <div v-if="showSelectButton">
            <input v-if="showSelectButton" type="checkbox" :value="card.id" v-model="selected" 
              class="w-6 h-6 appearance-none
                absolute bottom-0 md:bottom-2 left-1/2 -translate-x-1/2 z-10
                border-2 border-primary-200/[0.8] dark:border-neutral-600 rounded-full 
                bg-primary-100/[0.5]
                cursor-pointer"
            >
            <span 
              :class="{ 'bg-primary-200' : selected.includes(card.id) }"
              class="w-6 h-6 absolute bottom-0 md:bottom-2 left-1/2 -translate-x-1/2 z-10 rounded-full cursor-pointer pointer-events-none
                flex justify-center items-center transition ease-out duration-100"
            >
              <CheckIcon v-if="selected.includes(card.id)" class="-ml-[1px] w-3 h-3 stroke-[3px] stroke-primary-800"/>
            </span>
          </div>
          <DeckSlideItem :card='card'/>
        </div>
      </div>

      <!-- Right arrow -->
      <div 
        class="md:p-2 rounded-full md:hover:bg-secondary-50 md:dark:hover:bg-secondary-dark-800 cursor-pointer"
        @click="x+=300"
      >
        <ChevronRightIcon class="w-6 h-6 md:w-8 md:h-8 stroke-2 stroke-secondary-500"/>
      </div>
    </div>

    <div v-if="props.role === 'owner' || props.role === 'collaborator'" class="mt-2 md:mt-0 flex">
      <Button2 v-if="!showSelectButton" name="New card" @click="showCreateCardForm = true">
        <PlusCircleIcon class="w-5 h-5 mr-1 fill-secondary-500"/>
      </Button2>
      <div v-if="cards.length">
        <Button2 v-if="!showSelectButton" class="ml-2" name="Select cards" @click="showSelectButton = true">
          <CheckCircleIcon class="w-4 h-4 mr-1 stroke-[3px] stroke-secondary-500"/>
        </Button2>

        <div v-else class="w-full flex items-center">
          <Button2 name="Delete" class="ml-2" textColor="text-red-500" bgColor="hover:bg-red-100/[0.3]" @click="showDeleteConfirm = true">
            <TrashIcon class="w-4 h-4 mr-1 stroke-[3px] stroke-red-500"/>
          </Button2>
          <Button2 name="Cancel" textColor="text-amber-500" bgColor="hover:!bg-amber-100/[0.3]" @click="showSelectButton = false; selected=[]">
            <XMarkIcon class="w-4 h-4 mr-1 stroke-[3px] stroke-amber-500"/>
          </Button2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusCircleIcon } from "@heroicons/vue/24/solid"
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, CheckIcon, TrashIcon, XMarkIcon } from "@heroicons/vue/24/outline"
import { useScroll } from '@vueuse/core'
import { useCardStore } from "~~/stores/CardStore"

const cardStore = useCardStore()
const route = useRoute()

const props = defineProps(['role'])

// Tool bar
const showCreateCardForm = ref(false)
const search = ref("")

const cards = computed(() => {
  return cardStore.cards.filter(card => card.question.toLowerCase().includes(search.value.toLowerCase()) || card.answer.toLowerCase().includes(search.value.toLowerCase()))
})

const showSelectButton = ref(false)
const selected = ref([])
const showDeleteConfirm = ref(false)

const deleteCards = async () => {
  try {
    await cardStore.batchDeleteCards(selected.value)
    showDeleteConfirm.value = false
    showSelectButton.value = false
    await cardStore.getAllCards(route.params.id)
  } catch (error) {
    console.log(error)
  }
}

// Scroll properties
const el = ref()
const { x } = useScroll(el, { behavior: 'smooth' })

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
</style>