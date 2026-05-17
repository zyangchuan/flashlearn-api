<template>
  <Card>
    <template v-slot:header>
      <h1 class="text-2xl font-bold dark:text-neutral-200">Create a new deck</h1>
    </template>

    <template v-slot:main>
      <Form ref="form">
        <div>
          <p class="mb-2 text-lg font-medium dark:text-neutral-200">Deck name</p>
          <FormTextField 
            v-model="deckName" 
            :validator="[required, maxLength(80)]"
            placeholder="e.g Physics Definitions"
          />
        </div>
        <div class="mt-7">
          <p class="mb-2 text-lg font-medium dark:text-neutral-200">Deck descriptions</p>
          <FormTextArea 
            v-model="deckDescription" 
            :validator="[maxLength(200)]"
            placeholder="e.g Flashcards for GCE A Level Physics definitions" 
          />
        </div>
      </Form>
    </template>

    <template v-slot:actions>
      <Button2 name="Cancel" @click="emit('close')"/>
      <Button2 name="Create" @click="createDeck()" />
    </template>
  </Card>
</template>

<script setup>
import { maxLength, required } from "~~/composables/validator"
import { useDeckStore } from "~~/stores/DeckStore"
const deckStore = useDeckStore()

const emit = defineEmits(['close'])
const form = ref()
const deckName = ref("")
const deckDescription = ref("")

const createDeck = async () => {
  if (form.value.validate()) {
    try {
      const deck = { deckName: deckName.value, deckDescription: deckDescription.value }
      await deckStore.createDeck(deck)
      await deckStore.getAllDecks()
      emit('close')
    } catch (error) {
      console.log(error)
    }
  }
}
</script>