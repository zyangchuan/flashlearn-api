<template>
  <div class="relative">
    <input 
      ref = "input"
      type = "date"
      :value = "modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      class="bg-secondary-100 dark:bg-secondary-dark-800 
        dark:text-neutral-200 font-medium outline-none box-border 
        border-2 border-transparent placeholder:text-secondary-300 
        dark:placeholder:text-secondary-dark-600 px-1 rounded-lg"
      :class="[size ? size : 'w-28 h-12', { '!border-red-500 dark:!border-[#e05151]': !valid }]"
    >
    <div 
      class="absolute -bottom-3 flex items-center transition ease-out duration-150"
      :class="{ 'translate-y-1': !valid}"
    >
    </div>
  </div>
</template>

<script setup>
import { useEventBus } from '@vueuse/core'
import { useFormStore } from "~~/stores/FormStore"
import { storeToRefs } from 'pinia'

const props = defineProps(['modelValue', 'size', 'placeholder', 'validator'])
const emit = defineEmits(['update:modelValue'])

const input = ref()
const valid = ref(true)

const formStore = useFormStore()
const { validating } = storeToRefs(formStore)
formStore.addValidState(valid)

const bus = useEventBus('validate')
bus.on(() => {
  validate(input.value.value)
})

</script>