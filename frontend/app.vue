<template>
  <meta name="viewport" 
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
  />
  <div :class="{ dark: properties.darkMode }">
    <div class="w-full h-screen overflow-x-hidden dark:bg-neutral-900 dark-transition">
      <div class="w-full">
        <TopBar />
        <NuxtLoadingIndicator />
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePropertiesStore } from './stores/PropertiesStore'
const properties = usePropertiesStore()
</script>

<style>
html {
  margin:0;
  padding:0;
}
</style>

