<template>
  <div class="w-full md:w-20 mt-2 md:mt-0 flex md:flex-col justify-center items-center md:justify-start md:h-full md:top-0 md:left-0 md:absolute">
    
    <!-- Edit card button -->
    <Tooltip class="mr-3 md:mr-0" label="Edit card" position="right">
      <div 
        class="w-10 h-10 md:w-11 md:h-11 p-2 rounded-full bg-amber-200/[0.2]"
        :class="{ 'hover:bg-amber-200/[0.3] cursor-pointer': cardStore.cards.length }"
        @click="toggleShowEditCardForm"
      >
        <PencilIcon 
          class="w-full h-full stroke-2"
          :class="cardStore.cards.length ? 'stroke-amber-500' : 'stroke-amber-500/[0.5]'"
        />
      </div>
    </Tooltip>
    <Overlay v-if="showEditCardForm">
      <DeckEditCardForm @close="showEditCardForm = false"/>
    </Overlay>

    <!-- Delete card button -->
    <Tooltip class="md:mt-3" label="Delete card" position="right">
      <div 
        class="w-10 h-10 md:w-11 md:h-11 p-2 rounded-full bg-red-300/[0.2]"
        :class="{ 'hover:bg-red-300/[0.3] cursor-pointer': cardStore.cards.length }"
        @click="toggleShowDeleteConfirm"
      >
        <TrashIcon 
          class="w-full h-full stroke-2"
          :class="cardStore.cards.length ? 'stroke-red-500' : 'stroke-red-400/[0.4]'"
        />
      </div>
    </Tooltip>

    <!-- Delete card confirmation -->
    <Overlay v-if="showDeleteConfirm">
      <Card>
        <p class="text-lg font-medium text-center dark:text-neutral-200">Are you sure you want to delete this card?</p>
        <template v-slot:actions>
          <Button2 name="No, do not delete" @click="showDeleteConfirm = false"/>
          <Button2 name="Yes, delete" textColor="font-medium text-red-500" bgColor="hover:bg-red-200/[0.2]" @click="deleteCard"/>
        </template>
      </Card>
    </Overlay>
  </div>
</template>

<script setup>
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline"
import { useCardStore } from "~~/stores/CardStore"
const cardStore = useCardStore()
const showDeleteConfirm = ref(false)
const showEditCardForm = ref(false)

const toggleShowDeleteConfirm = () => {
  if (cardStore.cards.length) {
    showDeleteConfirm.value = true
  }
}

const deleteCard = async () => {
  await cardStore.deleteCard()
  if (cardStore.cards.length) {
    cardStore.updateSelectedCard(cardStore.cards[0])
  } else {
    cardStore.updateSelectedCard({})
  }
  showDeleteConfirm.value = false
}

const toggleShowEditCardForm = () => {
  if (cardStore.cards.length) {
    showEditCardForm.value = true
  }
}
</script>