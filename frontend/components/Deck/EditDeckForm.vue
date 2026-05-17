<template>
  <Card>
    <template v-slot:header>
      <h1 class="text-2xl font-bold dark:text-neutral-200">Edit deck</h1>
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
          <p class="mb-2 text-lg font-medium dark:text-neutral-200">Description</p>
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
      <Button2 name="Done" @click="updateDeck()" />
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
deckName.value = deckStore.currentDeck.deck_name
deckDescription.value = deckStore.currentDeck.deck_description

const updateDeck = async () => {
  if (form.value.validate()) {
    try {
      await deckStore.updateDeck(deckName.value, deckDescription.value)
      await deckStore.getCurrentDeck()
      emit('close')
    } catch (error) {
      console.log(error)
    }
  }
}
</script>
