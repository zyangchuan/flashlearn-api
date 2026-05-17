<template>
  <div 
    class="h-8 px-2 rounded-lg cursor-pointer flex justify-center items-center"
    :class="bgColor"
  >
    <slot />
    <p 
      class="text-base font-medium"
      :class="textColor"
    >
      {{ name }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  name: { type: String },
  bgColor: { type: String, default: 'hover:bg-secondary-100/[0.3] dark:hover:bg-secondary-dark-800' },
  textColor: { type: String, default: 'text-secondary-500' }
})
</script>