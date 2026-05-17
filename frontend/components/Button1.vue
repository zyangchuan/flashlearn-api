<template>
  <div 
    class="px-3 py-1 hover:brightness-105 rounded-xl cursor-pointer flex items-center justify center"
    :class="bgColor"
  >
    <slot />
    <p 
      class="text-md font-medium"
      :class="textColor"
    >
      {{ name }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  name: { type: String },
  bgColor: { type: String, default: 'bg-primary-200' },
  textColor: { type: String, default: 'text-primary-900' }
})
</script>