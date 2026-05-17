<template>
  <div 
    class="w-[180px] min-h-[80px] p-2 pb-4 
      bg-white dark:bg-neutral-900
      shadow-md dark:shadow-none
      rounded-md flex flex-col 
      absolute bottom-10 z-10"
  >
    <!-- The arrow thing at the bottom -->
    <div class="w-5 h-5 bg-white dark:bg-neutral-900 rotate-45 absolute -bottom-2 left-[80px]"></div>

    <!-- Status -->
    <div class="flex justify-between">
      <p class="text-xs text-neutral-400">Tasks Scheduled</p>
    </div>

    <!-- Tasks -->
    <div v-for="task in tasks" :key="task.id">
      <div class="flex flex-col mt-2">
        <div class="flex justify-between items-center">
          <p class="text-sm font-medium text-black dark:text-neutral-300">
            {{ task.task }}
          </p>

          <!-- Go button -->
          <div 
            class="w-8 h-5 
              bg-secondary-50 hover:bg-secondary-50/[0.7]
              dark:bg-secondary-dark-800 dark:hover:bg-secondary-dark-700
              rounded-full cursor-pointer 
              flex justify-center items-center"
          >
            <ArrowRightIcon class="w-4 h-4 stroke-secondary-400 dark:stroke-secondary-dark-300 stroke-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowRightIcon } from "@heroicons/vue/24/outline"

const props = defineProps(['tasks'])

</script>