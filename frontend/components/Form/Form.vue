<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
import { useEventBus } from '@vueuse/core'
import { useFormStore } from "~~/stores/FormStore"

const bus = useEventBus('validate')

const formStore = useFormStore()
formStore.$reset()

const validate = () => {
  bus.emit('validate')
  return formStore.formValid
}

defineExpose({ validate })
</script>
