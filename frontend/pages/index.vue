<template>
  <div>
    <div class="w-full min-h-screen p-12 flex justify-center items-center">
      <div>
        <div class="w-full flex flex-col md:flex-row items-center">
          <h1 
            class="text-5xl font-bold text-center
              dark:text-white
              md:text-left md:text-[65px]
              md:w-80 md:mr-12 
              xl:text-[90px]
              xl:w-[500px] xl:mr-16"
          >
            The best flashcard app ever.
          </h1>
          <CardStack class="mt-12 md:mt-0" />
        </div>
        <div class="mt-20 flex justify-center">
          <Button1 class="!py-2" name="Experience now" @click="router.push('/app')" />
        </div>
      </div>
    </div>
    <div class="w-full h-screen bg-green-300">Page 2</div>
    <div class="w-full h-screen bg-yellow-300">Page 3</div>
  </div>
</template>

<script setup>
import CardStack from "~~/components/LandingPage/CardStack.vue"
const router = useRouter()
</script>
