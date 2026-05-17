<template>
  <div>
    <!-- Go back button -->
    <div class="flex">
      <Button2 name="Back" @click="router.go(-1)">
        <ChevronLeftIcon class="w-5 h-5 mr-1 stroke-2 stroke-secondary-500" />
      </Button2>
    </div>
    <h1 class="mb-6 text-4xl font-bold text-center dark:text-neutral-100">{{ timer }}</h1>
    <div>
      <div class="flex flex-col justify-center items-center" v-if="countDownTime">
        <h1 class="mb-3 text-2xl md:text-3xl font-bold dark:text-neutral-100">Game starts in</h1>
        <DotLottieVue ref="countDownAnimationRef" style="height: 150px; width: 150px" autoplay src="https://lottie.host/e6d574a1-9554-417a-aff9-7ae33527bfc7/W3PvXz71lS.json"/>
      </div>
      <div v-else class="w-full min-h-0 flex justify-center flex-wrap gap-2 md:gap-3 lg:gap-5">
        <div v-for="card in cards" :key="card.questionId ? card.questionId : card.answerId">
          <BlitzCard 
            v-if="card.type === 'question'" 
            :card="card"
            :disabled="questionCardDisabled"
            @click="() => { if (!questionCardDisabled || card.selected) selectCard(card) }"
            class="border-cyan-200 border-2 border-opacity-0 rounded-xl box-content transition ease-in-out duration-200"
          />
          <BlitzCard v-else 
            :card="card" 
            :disabled="answerCardDisabled"
            @click="() => { if (!answerCardDisabled || card.selected) selectCard(card) }"
            class="border-cyan-200 border-2 border-opacity-0 rounded-xl box-content transition ease-in-out duration-200"
          />
        </div>
      </div>

      <Overlay v-if="showGameResult">
        <Card>
          <p class="text-2xl font-bold text-center dark:text-neutral-200">Blitz Result</p>
          <p class="mt-7 text-lg font-medium text-center text-neutral-500 dark:text-neutral-400">Your timing is</p>
          <p class="mt-2 text-4xl font-medium text-center text-primary-400">{{ timer }}</p>
          <p class="mt-5 text-lg font-medium text-center text-neutral-500 dark:text-neutral-400">Accuracy</p>
          <p class="mt-2 text-4xl font-medium text-center"
            :class="{ 'text-emerald-400': accuracy > 70,
            'text-amber-400': accuracy > 50 && accuracy < 70,
            'text-red-500': accuracy < 50 }"
          >
            {{ accuracy.toFixed(1) }} %
          </p>
          <template v-slot:actions>
            <Button2 name="Done" @click="endGame"/>
          </template>
        </Card>
      </Overlay>

      <Overlay v-if="showNavigationGuard">
        <Card>
          <p class="text-lg font-medium text-center dark:text-neutral-200">Are you sure you want to leave? The game is not over yet!</p>
          <template v-slot:actions>
            <Button2 name="No, do not leave" @click="showNavigationGuard = false"/>
            <Button2 name="Yes, leave" textColor="font-medium text-red-500" bgColor="hover:bg-red-200/[0.2]" @click="() => { gameEnded = true; router.go(-1) }"/>
          </template>
        </Card>
      </Overlay>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeftIcon } from "@heroicons/vue/24/outline"
import axios from 'axios'
import { io } from 'socket.io-client'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { useEventBus } from '@vueuse/core'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

// Websocket 
const socket = io(config.BASE_URL, {
  withCredentials: true
}) 

// Navigation guard
const showNavigationGuard = ref(false)
onBeforeRouteLeave((to, from) => {
  if (!gameEnded.value) {
    showNavigationGuard.value = true
    return false
  } else {
    gameEndsBus.emit()
    socket.disconnect()
  }
})

const cards = ref([])
const remainingCardsCount = ref(0)
const questionCardDisabled = ref(false)
const answerCardDisabled = ref(false)
const selectedCards = ref(new Set())

const selectCard = (card => {
  if (selectedCards.value.has(card)) {
    selectedCards.value.delete(card)
    card.selected = false

  } else if (selectedCards.value.size < 2) {
    selectedCards.value.add(card)
    card.selected = true

    if (card.type === 'question') {
      questionCardDisabled.value = true
    } else {
      answerCardDisabled.value = true
    }
  }

  if (selectedCards.value.size === 0) {
    questionCardDisabled.value = false
    answerCardDisabled.value = false
  }

  if (selectedCards.value.size === 2) {
    let questionCard = {}
    let answerCard = {}
    
    selectedCards.value.forEach(card => {
      if (card.type === 'question') {
        questionCard = card
      } else {
        answerCard = card
      }
    })

    socket.emit('blitz:checkAnswer', route.params.id, questionCard, answerCard)
    
    socket.once('blitz:checkAnswer', async correct => {
      if (correct) {
        questionCard.completed = true
        answerCard.completed = true
        remainingCardsCount.value -= 2

        if (!remainingCardsCount.value) {
          cards.value = []
          await getNewCards()
        }
      } else {
        questionCard.playWrongAnimation()
        answerCard.playWrongAnimation()
      }
    })

    selectedCards.value.clear()
    questionCardDisabled.value = false
    answerCardDisabled.value = false
  }
})

const getNewCards = async () => {
  socket.emit('blitz:getBlitzCards', route.params.id)
  socket.once('blitz:getBlitzCards', blitzGameCards => {
    remainingCardsCount.value = blitzGameCards.length
    blitzGameCards.forEach(card => {
      if (card.questionId) {
        cards.value.push(new BlitzQuestionCard(card))
      } else {
        cards.value.push(new BlitzAnswerCard(card))
      }
    })
  })
}

// Count down time
const countDownTime = ref(3)
const countDownAnimationRef = ref(null)

// Timer
const timer = ref('00:00:00')
socket.on('blitz:timer', time => {
  timer.value = time
})

// Emit event to close side bars
const gameStartsBus = useEventBus('gameStarts')
const gameEndsBus = useEventBus('gameEnds')

// Game ends listener
const showGameResult = ref(false)
const accuracy = ref(0)
const gameEnded = ref(false)

socket.on('blitz:gameEnds', res => {
  accuracy.value = res
  showGameResult.value = true
  gameEnded.value = true
})

const endGame = () => {
  showGameResult.value = false
  gameEndsBus.emit()
  socket.disconnect()
  router.push('/app/decks')
}

onMounted(async () => {
  // Start game
  gameStartsBus.emit()

  // Start count down
  if (countDownAnimationRef.value) {
    const dotLottie = countDownAnimationRef.value.getDotLottieInstance();
    dotLottie.addEventListener('play', () => {
      const countDown = setInterval(() => {
        countDownTime.value -= 1
        if (!countDownTime.value) {
          clearInterval(countDown)
          socket.emit('blitz:startTimer')
        }
      }, 1000)
    });
  }

  try {
    // Create blitz card set
    await axios.get(config.API_BASE_URL + '/blitz/' + route.params.id)
    
    if (!cards.value.length) {
      getNewCards()
    }
    
  } catch (error) {
    console.log(error)
  }
})

class BlitzGameCard {
  constructor (card) {
    this.cardId = card.cardId
    this.selected = false
    this.wrong = false
    this.completed = false
  }

  playWrongAnimation () {
    this.wrong = true
    setTimeout(() => {
      this.wrong = false
      this.selected = false
    }, 200)
  }
}

class BlitzQuestionCard extends BlitzGameCard {
  constructor(card) {
    super(card)
    this.type = 'question'
    this.questionId = card.questionId
    this.question = card.question
  }
}

class BlitzAnswerCard extends BlitzGameCard {
  constructor(card) {
    super(card)
    this.type = 'answer'
    this.answerId = card.answerId
    this.answer = card.answer
  }
}
</script>