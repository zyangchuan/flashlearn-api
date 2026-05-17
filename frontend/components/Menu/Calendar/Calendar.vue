<template>
  <div 
    class="max-w-[280px] md:w-full 
      bg-white dark:bg-neutral-800 
      border-2 dark:border-neutral-700 md:border-none
      md:shadow-lg dark:shadow-none 
      rounded-xl"
  >
    <div class="w-full h-full rounded-xl">
      <!-- Calendar top bar -->
      <MonthYearBar />
      
      <!-- Calendar dates section -->

      <!-- Days -->
      <div class="mx-3 pt-2 border-b-2 border-neutral-200 dark:border-neutral-600 flex justify-between">
        <p 
          v-for="day in days" :key="day" 
          class="w-7 text-sm text-center dark:text-neutral-300"
        >
          {{ day }}
        </p>
      </div>

      <!-- Dates -->
      <div class="mx-3 py-2 flex flex-col justify-between">
        <!-- Row -->
        <div v-for="row in 6" :key="row" class="flex justify-between">
          <!-- Each date -->
          <div 
            v-for="day in 7" :key="day" 
            class="w-7 h-6 my-[2px]"
          >
            <CalendarDate v-if="dates[row-1][day-1]" :date="dates[row-1][day-1]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MonthYearBar from '~~/components/Menu/Calendar/MonthYearBar.vue'
import CalendarDate from '~~/components/Menu/Calendar/CalendarDate.vue'
import { storeToRefs } from "pinia"
import { useCalendarStore } from "~~/stores/CalendarStore"

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

// Initiate date object
const date = new Date()

const calendarStore = useCalendarStore()
calendarStore.initiateDates(date)

const { dates } = storeToRefs(calendarStore)
</script>