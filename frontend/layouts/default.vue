<template>
  <div>
    <div 
      class="relative md:static 
        w-full h-screen 
        p-3 pt-16
        flex justify-between"
    >
      <!-- Leftside bar -->
      <div
        class="fixed md:static z-40 md:z-0 top-24 
          flex justify-center shrink-0
          transition duration-300"
        :class="{ '-translate-x-[200px] md:translate-x-0': !properties.showNavBar, 'md:!-translate-x-[280px]': !gameMode }">
        <NavBar @close="properties.showNavBar = false" />
      </div>

      <!-- Middle content -->
      <div 
        class="content w-full h-full pb-3 px-2 overflow-scroll md:px-10 transition duration-300"
        :class="{ 'md:w-screen absolute': !gameMode }"
      >
        <div 
          class="w-full h-full left-0 top-0 fixed bg-white/20 backdrop-blur-[1px] z-10" 
          v-if="properties.showNavBar"
          @click="properties.showNavBar = false"
        ></div>
        <slot/>
      </div>

      <!-- Rightside calendar and timeline -->
      <div
        class="fixed z-40 top-24 right-3 md:static
          flex flex-col items-center shrink-0
          transition duration-300"
        :class="{ 'translate-x-[280px] md:transform-none': !properties.showNavBar, 'md:!translate-x-[280px]': !gameMode }"
      >
        <div class="max-w-[360px]">
          <Calendar />
          <h1 class="text-xl mt-7 mb-4 font-medium dark:text-neutral-200">Upcoming tasks</h1>
          <Timeline />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import component
import NavBar from '~~/components/Menu/NavBar/NavBar.vue'
import Calendar from '~~/components/Menu/Calendar/Calendar.vue'
import Timeline from '~~/components/Menu/Timeline/Timeline.vue'

const gameMode = ref(true)

// Import store
import { usePropertiesStore } from '../stores/PropertiesStore'
const properties = usePropertiesStore()

// Event bus
import { useEventBus } from '@vueuse/core'
const gameStartsBus = useEventBus('gameStarts')
gameStartsBus.on(() => {
  gameMode.value = false
})

const gameEndsBus = useEventBus('gameEnds')
gameEndsBus.on(() => {
  gameMode.value = true
})

</script>

<style scoped>
.content {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}
.content::-webkit-scrollbar { 
  display: none;  /* Safari and Chrome */
}
</style>