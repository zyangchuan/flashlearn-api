<template>
  <div 
    class="w-full h-27 p-4
      bg-[inherit]
      fixed top-0 z-40
      flex justify-between items-center"
  >
    <!-- FlashLearn logo -->
    <div class="flex items-center cursor-pointer" @click="router.push('/')">
      <BoltIcon class="w-7 h-7 dark:fill-white"/>
      <h1 class="text-2xl font-semibold dark:text-white">FlashLearn</h1>
    </div>

    <!-- Dark mode switch -->
    <div class="flex items-center">
      <SunIcon class="w-6 h-6 dark:fill-white" />
      <!-- Switch background-->
      <div 
        class="w-11 h-5 mx-1 p-[3px]
          rounded-full cursor-pointer 
          bg-primary-300 dark:bg-secondary-300 
          shadow-[0_1px_10px_rgba(0,0,0,0.10)]
          dark:shadow-none"
        @click="properties.toggleDarkMode"
      >
        <!-- Switch circle -->
        <div 
          class="w-[14px] h-[14px] 
            rounded-full 
            bg-white dark:translate-x-6 
            transition ease-out duration-300"
        ></div>
      </div>
      <MoonIcon class="w-[20px] h-[20px] dark:fill-white" />
      <MenuToggleButton class="md:hidden" v-if="route.path.includes('app')" />
    </div>
  </div>
</template>

<script setup>
import { BoltIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/solid'
import { usePropertiesStore } from '~~/stores/PropertiesStore'
const properties = usePropertiesStore()
const router = useRouter()
const route = useRoute()
</script>