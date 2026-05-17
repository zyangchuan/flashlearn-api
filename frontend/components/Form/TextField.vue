<template>
  <div class="relative">
    <input 
      ref="input"
      :type="type ? type: 'text'" 
      :placeholder="placeholder ? placeholder: ''"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      class="px-3 rounded-lg
        bg-secondary-100 dark:bg-secondary-dark-800 
        text-secondary-900 dark:dark:text-secondary-dark-100 font-medium
        outline-none box-border border-2 border-transparent
        placeholder:text-sm
        placeholder:text-secondary-300 dark:placeholder:text-secondary-dark-500"
      :class="[size ? size : 'w-full h-12', { '!border-red-500 dark:!border-[#e05151]': !valid }]"
    >
    <div 
      class="absolute -bottom-3 flex items-center transition ease-out duration-150"
      :class="{ 'translate-y-1': !valid}"
    >
      <ExclamationCircleIcon 
        class="w-3 h-3 mr-1 fill-transparent transition ease-out duration-[200ms]"
        :class="{ '!fill-red-500 dark:!fill-[#e05151]': !valid }"
      />
      <p 
        v-if="errorMsg.length"
        class="text-xs text-transparent transition ease-out duration-[200ms]"
        :class="{' !text-red-500 dark:!text-[#e05151]': !valid }"
      >{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ExclamationCircleIcon } from "@heroicons/vue/20/solid"
import { useEventBus } from '@vueuse/core'
import { useFormStore } from "~~/stores/FormStore"
import { storeToRefs } from 'pinia'

const props = defineProps(['type', 'modelValue', 'size', 'placeholder', 'validator'])
const emit = defineEmits(['update:modelValue'])

const input = ref()
const valid = ref(true)
const errorMsg = ref("")

const validate = (value) => {
  // Get result of all validations
  const validateResult = props.validator.map(validator => validator.validate(value))
  const invalidResult = validateResult.find(result => result.valid === false)
  if (invalidResult) {
    errorMsg.value = invalidResult.errorMsg
    valid.value = false
  } else {
    errorMsg.value = ""
    valid.value = true
  }
}

const formStore = useFormStore()
const { validating } = storeToRefs(formStore)
formStore.addValidState(valid)

const bus = useEventBus('validate')
bus.on(() => {
  validate(input.value.value)
})

</script>