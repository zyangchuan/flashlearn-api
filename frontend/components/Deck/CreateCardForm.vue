<template>
  <Card>
    <template v-slot:header>
      <h1 class="text-2xl font-bold dark:text-neutral-200">Create a new card</h1>
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
      <Button2 name="Create" @click="createCard()" />
    </template>
  </Card>
</template>

<script setup>
import { maxLength, required } from "~~/composables/validator"
import { useCardStore } from "~~/stores/CardStore"
const cardStore = useCardStore()

const route = useRoute()
const emit = defineEmits(['close'])
const form = ref()
const question = ref("")
const answer = ref("")

const createCard = async () => {
  if (form.value.validate()) {
    const card = { type: 0, question: question.value, answer: answer.value }
    await cardStore.createCard(card)
    await cardStore.getAllCards(route.params.id)
    cardStore.updateSelectedCard(cardStore.cards[cardStore.cards.length-1])
    emit('close')
  }
}
</script>
