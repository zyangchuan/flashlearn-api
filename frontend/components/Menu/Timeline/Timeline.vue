<template>
  <div>
    <div class="flex">
      <Button2 name="Create task" @click="showCreateTaskForm=true">
        <PlusCircleIcon class="w-5 h-5 mr-1 fill-secondary-500"/>
      </Button2>
    </div>

    <Overlay v-if="showCreateTaskForm">
      <CreateTaskForm ref="createDeckForm" @close="showCreateTaskForm = false"/>
    </Overlay>

    <div 
      v-if="upcomingTasks"
      class="w-[4px] min-h-[150px] max-h-[400px] 
        bg-neutral-300 dark:bg-neutral-700 rounded-full
        flex flex-col justify-between"
    >
      <!-- Upcoming tasks -->
      <div>
        <div 
          v-for="task in upcomingTasks" :key="task.id"
          class="w-[260px] min-h-[50px] my-2 relative flex items-center"
        >
          <!-- Horizontal line -->
          <MenuTimelineHorizontalLine />
          
          <!-- Task -->
          <MenuTimelineTask :task='task' />
        </div>
      </div>

      <!-- Today -->
      <div class="w-[230px] min-h-[50px] mt-10 relative flex items-center">
        <MenuTimelineHorizontalLine />
        <!-- Task -->
        <div 
          class="w-[120px] h-12 p-2 rounded-xl bg-white dark:bg-neutral-800 border-2 dark:border-neutral-700 md:border-none md:shadow-md md:dark:shadow-none flex justify-between items-center"
        >
          <div class="px-2 pb-[3px] bg-primary-50 dark:bg-primary-dark-900 rounded-lg flex flex-col justify-center items-center">
            <p class="text-[14px] font-medium text-primary-400 dark:text-primary-dark-200">{{ calendarStore.today.getDate() }}</p>
            <p class="text-[10px] text-primary-400 dark:text-primary-dark-200 -mt-2">{{ calendarStore.today.toLocaleString('default', { month: 'short' }) }}</p>
          </div>
          <p 
            class="text-sm font-medium text-end text-primary-400 dark:text-primary-dark-200"
          >
            Today
          </p>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="dark:text-neutral-200">No upcoming tasks</p>
    </div>
  </div>
  
</template>

<script setup>
import CreateTaskForm from "~~/components/Menu/Timeline/CreateTaskForm"
import { useCalendarStore } from "~~/stores/CalendarStore";
import { PlusCircleIcon } from "@heroicons/vue/24/solid"

const calendarStore = useCalendarStore()
const showCreateTaskForm = ref(false)
const form = ref()
const taskName = ref("")

const upcomingTasks = computed(() => {
  if (calendarStore.tasks.length) {
    const tasks = calendarStore.tasks.filter(task => task.date > calendarStore.today)
    return tasks.slice(0, 3)
  }
})


</script>
