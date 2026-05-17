<template>
  <div>
    <div>
      <h1 class="text-2xl font-bold dark:text-neutral-200">My Decks</h1>

      <div class="my-2">
        <div class="flex justify-between items-center">
          <!-- New deck -->
          <Button2 name="New deck" @click="showCreateDeckForm = true">
            <PlusCircleIcon class="w-5 h-5 mr-1 fill-secondary-500"/>
          </Button2>
          <!-- New deck form -->
          <Overlay v-if="showCreateDeckForm">
            <DeckCreateDeckForm ref="createDeckForm" @close="showCreateDeckForm = false"/>
          </Overlay>
          <!-- Search bar -->
          <SearchBar v-model="search" placeholder="Search deck" class="w-1/2 max-w-[250px]"/>
        </div>
      </div>

      <div v-if="decksLoading" class="flex flex-wrap gap-3 md:gap-5">
        <DeckSkeleton />
        <DeckSkeleton />
        <DeckSkeleton />
      </div>

      <!-- Decks container div -->
      <div v-else class="flex flex-wrap gap-3 md:gap-5">
        <Deck 
          v-for="deck in decks" :key="deck.id" 
          :deck="deck"
        />
      </div>
      
    </div>
  </div>
</template>

<script setup>
import Deck from "~~/components/Deck/Deck"
import DeckSkeleton from "~~/components/Deck/Skeleton/DeckLoading"
import { PlusCircleIcon } from "@heroicons/vue/24/solid"
import { BarsArrowDownIcon } from "@heroicons/vue/24/outline"
import { onClickOutside } from "@vueuse/core"
import { useDeckStore } from "~~/stores/DeckStore"

// Deck
const deckStore = useDeckStore()
const decksLoading = ref(true)
onMounted(async () => {
  try {
    await deckStore.getAllDecks()
    decksLoading.value = false
  } catch (error) {
    console.log(error)
  }
})
const showCreateDeckForm = ref(false)
const createDeckForm = ref()

// Search bar
const search = ref("")
const decks = computed(() => {
  return deckStore.decks.filter(deck => deck.deck_name.toLowerCase().includes(search.value.toLowerCase()))
})

onClickOutside(createDeckForm, () => showCreateDeckForm.value = false)
</script>