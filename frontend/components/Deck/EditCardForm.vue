<template>
  <Card>
    <template v-slot:header>
      <h1 class="text-2xl font-bold dark:text-neutral-200">Edit card</h1>
    </template>

    <template v-slot:main>
      <Form ref="form">
        <div>
          <p class="mb-2 text-lg font-medium dark:text-neutral-200">Question</p>
          <FormTextField 
            v-model="question" 
            :validator="[required, maxLength(100)]"
            placeholder="E.g Definition of velocity"
          />
        </div>
        <div class="mt-7">
          <p class="mb-2 text-lg font-medium dark:text-neutral-200">Answer</p>
          <FormTextArea 
            v-model="answer" 
            :validator="[maxLength(150)]"
            placeholder="E.g the rate of change of displacement of an object."
          />
        </div>
      </Form>
    </template>

    <template v-slot:actions>
      <Button2 name="Cancel" @click="emit('close')"/>
      <Button2 name="Done" @click="updateCard()" />
    </template>
  </Card>
</template>

<script setup>
import { maxLength, required } from "~~/composables/validator"
import { useCardStore } from "~~/stores/CardStore"

const cardStore = useCardStore()

const emit = defineEmits(['close'])
const form = ref()
const question = ref("")
const answer = ref("")
question.value = cardStore.selectedCard.question
answer.value = cardStore.selectedCard.answer

const updateCard = async () => {
  if (form.value.validate()) {
    await cardStore.updateCard(question.value, answer.value)
    emit('close')
  }
}
</script>
