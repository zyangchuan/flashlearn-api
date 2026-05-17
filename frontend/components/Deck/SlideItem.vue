<template>
  <div 
    class="card flex justify-center items-center box-border border-2"
    :class="(cardStore.selectedCard.id === card.id) ? 'bg-secondary-100 dark:bg-secondary-dark-700 border-secondary-200 dark:border-secondary-dark-600' : 'border-transparent dark:border-neutral-800 bg-white-100'"
    @click="cardStore.updateSelectedCard(card)"
  >
    <p 
      class="text-xs text-center overflow-hidden text-ellipsis"
      :class="(cardStore.selectedCard.id === card.id) ? 'text-secondary-900 dark:text-secondary-dark-100' : 'text-neutral-600'"
    >
      {{ question }}
    </p>
  </div>
</template>

<script setup>
import { useCardStore } from "~~/stores/CardStore"
const cardStore = useCardStore()
const props = defineProps(['card'])

const QUESTION_DISPLAY_LENGTH = 30
const question = computed(() => {
  return (props.card.question.length > QUESTION_DISPLAY_LENGTH) ? props.card.question.slice(0, QUESTION_DISPLAY_LENGTH) + "..." : props.card.question
})

</script>

<style scoped>
.card {
  @apply w-28 h-12 md:w-36 md:h-14 my-3 md:my-5 mx-2 p-2 px-4 shadow dark:shadow-none rounded-xl static cursor-pointer transition ease-out duration-200;
}
</style>