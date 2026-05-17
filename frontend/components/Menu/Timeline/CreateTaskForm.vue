<template>
  <Card>
    <template v-slot:header>
      <h1 class="text-2xl font-bold dark:text-neutral-200">Create a new task</h1>
    </template>

    <template v-slot:main>
      <Form ref="form">
        <div>
          <p class="mb-2 text-lg font-medium dark:text-neutral-200">Task name</p>
          <FormTextField 
            v-model="taskName" 
            :validator="[required, maxLength(50)]"
            placeholder="Math Assignment 1B"
          />
        </div>
        <div class="mt-7">
          <p class="mb-2 text-lg font-medium dark:text-neutral-200">Task date</p>
          <FormDate v-model="date" class="w-full"/>
        </div>
      </Form>
    </template>

    <template v-slot:actions>
      <Button2 name="Cancel" @click="emit('close')"/>
      <Button2 name="Create" @click="createTask"/>
    </template>
  </Card>
</template>

<script setup>
import { maxLength, required } from "~~/composables/validator"
import { useCalendarStore} from "~/stores/CalendarStore"
const calendarStore = useCalendarStore()

const emit = defineEmits(['close'])
const form = ref()
const date = ref()
const taskName = ref()

const createTask = () => {
  const task = {date: new Date(date.value), task: taskName, taskid: Math.floor(Math.random() * 100)}
  calendarStore.addTask(task)
  emit('close')
}
</script>