<template>
  <div 
    class="w-36 h-28 md:w-44 md:h-28 lg:w-60 lg:h-36 p-1 md:p-3 lg:p-5 shadow-[2px_2px_10px_rgba(0,0,0,0.10)] rounded-xl flex flex-col justify-between items-center cursor-pointer select-none"
    :class="{ 
      'bg-indigo-100 dark:bg-secondary-dark-600': card.type === 'question', 
      'bg-sky-100 dark:bg-secondary-dark-200': card.type === 'answer',
      'border-opacity-100 scale-105': props.card.selected,
      'opacity-50': disabled && !props.card.selected,
      '!scale-0': card.completed,
      'scaleUp': cardLoad,
      '!bg-red-200 !border-red-300 horizontal-shaking': card.wrong
    }"
  >
    <p 
      class="w-full text-xs lg:text-base text-center hyphens-auto text-secondary-900 dark:text-secondary-50"
    >
      {{ card.question || card.answer }}
    </p>
    <p v-if="card.question" class="text-[10px] lg:text-sm text-indigo-300 dark:text-sky-600">
      Question
    </p>
    <p v-else class="text-[10px] lg:text-sm text-sky-300 dark:text-sky-700">
      Answer
    </p>
  </div>
</template>

<script setup>
const props = defineProps(['card', 'disabled'])

const cardLoad = ref(false)
cardLoad.value = true

setTimeout(() => {
  cardLoad.value = false
}, 100)


</script>

<style scoped>
@keyframes horizontal-shaking {
  0% { transform: translateX(0) }
  25% { transform: translateX(3px) }
  50% { transform: translateX(-3px) }
  75% { transform: translateX(3px) }
  100% { transform: translateX(0) }
}

@keyframes scaleUp {
  0% { transform: scale(0) }
  100% { transform: scale(1) }
}

.horizontal-shaking {
  animation: horizontal-shaking 0.2s ease-in-out;
}

.scaleUp {
  animation: scaleUp 0.1s ease-in-out;
}
</style>