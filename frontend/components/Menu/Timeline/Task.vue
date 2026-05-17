<template>
  <div 
    class="min-w-[160px] min-h-12 p-2 rounded-xl bg-white dark:bg-neutral-800 border-2 dark:border-neutral-700 md:border-none md:shadow-md md:dark:shadow-none flex justify-between items-center"
  >
    <div class="px-2 pb-1 bg-secondary-50 dark:bg-secondary-dark-800 rounded-lg flex flex-col justify-center items-center">
      <p class="text-[14px] font-medium text-secondary-400 dark:text-secondary-dark-300">{{ task.date.getDate() }}</p>
      <p class="text-[10px] text-secondary-400 dark:text-secondary-dark-300 -mt-2">{{ task.date.toLocaleString('default', { month: 'short' }) }}</p>
    </div>
    <div class="ml-4 flex items-center">
      <p 
        class="w-20 text-sm font-medium text-end text-neutral-800 dark:text-neutral-200"
      >
        {{ task.task }}
      </p>
      <div 
        class="w-8 h-5 ml-2
          bg-secondary-50 hover:bg-secondary-50/[0.7]
          dark:bg-secondary-dark-800 dark:hover:bg-secondary-dark-700
          rounded-full cursor-pointer 
          flex justify-center items-center"
      >
        <ArrowRightIcon class="w-4 h-4 stroke-secondary-400 dark:stroke-secondary-dark-300 stroke-2" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowRightIcon } from "@heroicons/vue/24/outline"

const props = defineProps(['task'])
</script>