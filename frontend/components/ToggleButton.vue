<template>
  <div 
    class="w-11 h-5 mx-1 p-[3px]
      rounded-full cursor-pointer 
      bg-primary-100 dark:bg-primary-dark-900
      shadow-[0_1px_10px_rgba(0,0,0,0.10)]
      dark:shadow-none"
    :class="{ '!bg-secondary-300': props.trueValue }"
  >
    <!-- Switch circle -->
    <div 
      class="w-[14px] h-[14px] 
        rounded-full 
        bg-white
        transition ease-out duration-300"
      :class="{ 'translate-x-6': props.trueValue }"
    ></div>
  </div>
</template>

<script setup>
const props = defineProps(['trueValue'])
</script>