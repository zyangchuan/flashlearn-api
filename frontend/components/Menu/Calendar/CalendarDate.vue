<template>
  <div class="relative w-full h-full flex justify-center items-center">
    <!-- Show the tasks due on the day when clicked -->
    <TaskInfo 
      ref="target"
      v-if="showTask" 
      :tasks="tasks" 
    />

    <!-- Render dates with tasks if there are tasks on the day -->
    <div 
      v-if="tasks[0]" 
      class="hasTasks" 
      :class="{ 'today': isToday }"
      @click="calendarStore.activeDate = date.toDateString()"
    >
      <p class="text-xs font-medium text-center dark:text-neutral-300">
        {{ date.getDate() }}
      </p>
      <div 
        class='w-[5px] h-[5px] rounded-full bg-green-300 dark:bg-green-300 absolute -bottom-1'
      ></div>
    </div>

    <!-- Else render normal dates -->
    <div 
      v-else
      :class="{ 'today': isToday }"
    >
      <p class="text-xs font-medium text-center dark:text-neutral-200">
        {{ date.getDate() }}
      </p>
    </div>
  </div>
</template>

<script setup>
import TaskInfo from '~~/components/Menu/Calendar/TaskInfo.vue'
import { useCalendarStore } from "~~/stores/CalendarStore"
import { onClickOutside } from '@vueuse/core'

const calendarStore = useCalendarStore()
const props = defineProps(['date'])

// Check if any of the tasks is on this day
const tasks = computed(() => {
  return calendarStore.tasks.filter(task => task.date.toDateString() === props.date.toDateString())
})

// Check if this date is today
const isToday = computed(() => {
  return props.date.toDateString() === calendarStore.today.toDateString()
})

const showTask = computed(() => {
  return calendarStore.activeDate === props.date.toDateString()
})

const target = ref()
onClickOutside(target, () => calendarStore.activeDate = "")

</script>

<style scoped>
.hasTasks {
  @apply w-5 h-5 rounded-full hover:bg-green-100 dark:hover:bg-green-300/[0.6] cursor-pointer relative flex justify-center items-center;
}

.today {
  @apply w-5 h-5 rounded-full bg-primary-200 dark:bg-primary-dark-200 flex justify-center items-center;
}
</style>