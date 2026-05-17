import { defineStore } from 'pinia'

export const useCalendarStore = defineStore('calendarStore', {
  state: () => ({
    calendar: [],
    tasks: [
     { date: new Date("Sat Sep 23 2023"), task: "Math Assignment 2A", taskid: 3 },
     { date: new Date("Thu Sep 28 2023"), task: "Chemistry Tutorial", taskid: 2 },
     { date: new Date("Tue Sep 26 2023"), task: "Biology Practice Paper", taskid: 1 },
    ],
    activeDate: "", // Date which the user clicked on to show the task. This ensures only 1 task window is opened at a time.
    today: new Date(),
    month: 0,
    FORWARD_LIMIT: 5 // Limit on the number of months for which the user is allowed to move forward to.
  }),
  getters: {
    dates: (state) => {
      return state.calendar[state.month].dates
    },
    title: (state) => {
      return state.calendar[state.month].title
    }
  },
  actions: {
    getDatesInMonth(year, month) {
      // Initiate the first date of the month
      const dateObject = new Date(year, month, 1)
      
      // Create a 2D array of the calendar
      const datesOfMonth = []
      for (let row = 0; row < 6; row++) {
        datesOfMonth.push([]) // Create a row
    
        for (let day = 0; day < 7; day++) {
          datesOfMonth[row].push(null) // Create a slot
          
          if (day === dateObject.getDay() && dateObject.getMonth() === month) {
            datesOfMonth[row][day] = new Date(dateObject) // Assign the slot with a date
            dateObject.setDate(dateObject.getDate() + 1) // Next date
          }
        }
      }
    
      return datesOfMonth
    },
    initiateDates(date) {
      for (let i = 0; i < this.FORWARD_LIMIT + 1; i++) {
        this.calendar.push({title: date.getFullYear() + ", " + date.toLocaleString('default', { month: 'long' }),  dates: this.getDatesInMonth(date.getFullYear(), date.getMonth())})
        date.setMonth(date.getMonth() + 1)
      }
      this.today.setHours(0,0,0,0)
    },
    increaseMonth() {
      this.month++
    },
    decreaseMonth() {
      this.month--
    },
    addTask(task) {
      this.tasks.push(task)
    }
  }
})