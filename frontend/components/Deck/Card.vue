<template>
  <div style="perspective: 1000px;">
    <div class="container w-72 md:w-80 min-h-[180px] md:min-h-[200px] relative transition duration-300"
      :class="{ 'flipped': flipped }"
      @click="flipCard"
    >
      <div 
        ref="target"
        class="card front"
        :class="{ '!bg-neutral-200 dark:!bg-neutral-800': card.id === -1 }"
        :style="rotateFront"
      >
        <p 
          class="w-full text-lg md:text-xl text-center hyphens-auto text-secondary-900 dark:text-secondary-dark-100"
          :class="{ '!text-neutral-400': card.id === -1 }"
        >
          {{ card.question }}
        </p>
        <p v-if="card.id !== -1" class="text-sm md:text-base text-blue-300 dark:text-sky-700">
          Question
        </p>
      </div>
      <div 
        ref="target"
        class="card back"
        :style="rotateBack"
      >
        <p 
          class="text-sm md:text-base text-secondary-900 dark:text-secondary-dark-100"
        >
          {{ card.answer }}
        </p>
        <p class="text-sm md:text-base text-emerald-300 dark:text-emerald-700">
          Answer
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMouseInElement } from '@vueuse/core'
const props = defineProps(['card'])

const SWIVEL = 6 // How much the card swivels on hover

// Mouse position properties
const target = ref(null)
const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(target)

// Rotation around x axis value
const rotateX = computed(() => {
  return (-(elementY.value-(elementHeight.value/2))/(elementHeight.value/2) * SWIVEL);
})

// Rotation around y axis value
const rotateY = computed(() => {
  return ((elementX.value-(elementWidth.value/2))/(elementWidth.value/2) * SWIVEL);
})

// Rotation style when the card is facing front
const rotateFront = computed(() => {
  return isOutside.value ? "transform: rotateX(0) rotateY(0); transition-duration: 0.2s" : "transform: rotateX(" + rotateX.value + "deg)" + "rotateY(" + rotateY.value + "deg); transition-duration: 0s"
})

// Rotation style when the card is facing back
const rotateBack = computed(() => {
  return isOutside.value ? "transform: rotateX(0) rotateY(180deg); transition-duration: 0.2s" : "transform: rotateX(" + -rotateX.value + "deg)" + "rotateY(" + (rotateY.value+180) + "deg); transition-duration: 0s"
})

// Flip properties
const flipped = ref(false)
const flipCard = () => {
  // Only flip if there are cards in the deck
  if (props.card.id !== -1) flipped.value = !flipped.value
}
</script>

<style scoped>
.card {
  @apply w-full h-full p-5 bg-secondary-100 dark:bg-secondary-dark-700 shadow-[2px_2px_10px_rgba(0,0,0,0.10)] rounded-xl transition flex flex-col justify-between items-center;
}

.container {
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
}

.front {
  position: absolute;
  backface-visibility: hidden;
}

.back {
  position: absolute;
  transform: rotateY(180deg);
  backface-visibility: hidden;
}

.flipped {
  transform: rotateY(180deg);
}

</style>