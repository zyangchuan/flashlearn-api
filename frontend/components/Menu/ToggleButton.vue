<template>
  <div class="w-9 h-9 ml-6 cursor-pointer" @click='properties.toggleNavBar'>
    <Bars3BottomRightIcon class="dark:stroke-white" :class="{ 'hidden': properties.showNavBar }" />
    <XMarkIcon class="dark:stroke-white" :class="{ 'hidden': !properties.showNavBar }" />
  </div>
</template>

<script setup>
import { Bars3BottomRightIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { usePropertiesStore } from '../../stores/PropertiesStore'
const properties = usePropertiesStore()
</script>