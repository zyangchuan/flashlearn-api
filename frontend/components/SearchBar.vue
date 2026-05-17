<template>
  <div class="h-8 p-1 px-2 rounded-lg bg-secondary-50 dark:bg-secondary-dark-800 flex items-center">
    <MagnifyingGlassIcon class="w-4 h-4 mr-2 stroke-[3px] stroke-secondary-500 dark:stroke-secondary-dark-300" />
    <input 
      type="text" 
      :placeholder="placeholder" 
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      class="w-full h-full outline-none bg-secondary-50 dark:bg-secondary-dark-800 text-sm dark:text-secondary-dark-100 placeholder:text-secondary-300 dark:placeholder:text-secondary-dark-500"
    >
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline"
const props = defineProps(['modelValue','placeholder'])
const emit = defineEmits(['update:modelValue'])
</script>