<template>
  <div class="relative" @mouseenter="showToolTip = true" @mouseleave="showToolTip = false">
    <slot/>
    <div 
      ref="el"
      class="invisible md:visible h-6 rounded-md flex justify-center items-center bg-black absolute z-50"
      v-show="showToolTip"
      :style="style"
    >
      <span class="mx-2 text-xs text-white whitespace-nowrap">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
import { useElementSize } from '@vueuse/core'
const props = defineProps(['label', 'position'])
const showToolTip = ref(false)

const el = ref(null)
const { width, height } = useElementSize(el)

let style
switch (props.position) {
  case "top":
    style = computed(() => {
      return "margin-left: " + -Math.ceil(width.value/2) + "px; left: 50%; bottom: 120%;"
    })
    break

  case "bottom":
    style = computed(() => {
      return "margin-left: " + -Math.ceil(width.value/2) + "px; left: 50%; top: 120%;"
    })
    break

  case "left":
    style = computed(() => {
      return "margin-top: " + -Math.ceil(height.value/2) + "px; margin-right: 8px; right: 100%; top: 50%;"
    })
    break
  
  case "right":
    style = computed(() => {
      return "margin-top: " + -Math.ceil(height.value/2) + "px; margin-left: 8px; left: 100%; top: 50%;"
    })
    break
 
  default:
    style = computed(() => {
      return "margin-left: " + -Math.ceil(width.value/2) + "px; left: 50%; bottom: 120%;"
    })
    break
}



</script>