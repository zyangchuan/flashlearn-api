<template>
  <div 
    class="w-full h-8 px-2 rounded-t-xl
    bg-primary-100 dark:bg-primary-dark-900
    flex justify-between items-center"
  >
    <div 
      class="w-6 h-6 rounded-full 
        hover:bg-primary-200 dark:hover:bg-primary-dark-800 
        cursor-pointer 
        flex justify-center items-center"
      v-if="month > 0"
    >
      <ChevronLeftIcon 
        class="w-4 h-4 stroke-2 stroke-primary-900 dark:stroke-primary-dark-100"
        @click="calendarStore.decreaseMonth()"
      />
    </div>
    <div v-else class="w-6 h-6 rounded-full flex justify-center items-center">
      <ChevronLeftIcon 
        class="w-4 h-4 stroke-2 stroke-primary-300 dark:stroke-primary-200/[0.4]"
      />
    </div>

    <!-- Month and year title e.g April, 2023 -->
    <p class="text-sm font-medium text-primary-900 dark:text-primary-dark-100">
      {{ title }}
    </p>

    <div 
      class="w-6 h-6 rounded-full hover:bg-primary-200 dark:hover:bg-primary-dark-800 cursor-pointer flex justify-center items-center"
      v-if="month < FORWARD_LIMIT"
    >
      <ChevronRightIcon 
        class="w-4 h-4 stroke-2 stroke-primary-900 dark:stroke-primary-dark-100"
        @click="calendarStore.increaseMonth()"
      />
    </div>
    <div v-else class="w-6 h-6 rounded-full flex justify-center items-center">
      <ChevronRightIcon class="w-4 h-4 stroke-2 stroke-primary-300 dark:stroke-primary-200/[0.4]"/>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline"
import { storeToRefs } from "pinia"
import { useCalendarStore } from "~~/stores/CalendarStore"

const calendarStore = useCalendarStore()
const { month, dates, title, FORWARD_LIMIT } = storeToRefs(calendarStore)

</script>