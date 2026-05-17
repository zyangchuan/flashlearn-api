<template>
  <div class="w-full h-screen flex justify-center items-center">
    <div v-if="processing">
      <p class="text-5xl dark:text-neutral-100">. . .</p>
    </div>
    <div v-else>
      <div v-if="success" class="w-96 flex flex-col justify-center items-center">
        <CheckCircleIcon class="mx-auto w-20 h-20 fill-green-500"/>
        <p class="mt-5 text-2xl text-center dark:text-neutral-200">
          Your email has been verified successfully!
        </p>
        <p 
          class="mt-5 text-lg text-secondary-400 dark:text-secondary-500 cursor-pointer" 
          @click="router.push('/sign-in')"
        >
          Sign in
        </p>
      </div>
      <div v-else class="w-96 flex flex-col justify-center items-center">
        <XCircleIcon class="mx-auto w-20 h-20 fill-red-500"/>
        <p class="mt-5 text-3xl text-center dark:text-neutral-200">
          This link is not valid
        </p>
        <p class="mt-5 text-xl text-center text-neutral-600 dark:text-neutral-200">
          Please use the link you received in your email.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/24/solid"
import axios from "axios"
const router = useRouter()
const route = useRoute()

const processing = ref(true)
const success = ref(false)

onMounted(async () => {
  const config = useRuntimeConfig()
  try {
    processing.value = true
    const res = await axios.patch(config.API_BASE_URL + '/auth/verify-email', {
      email: route.query.email,
      verificationToken: route.query.verificationToken
    })
    if (res.data.msg === "email_verified") {
      processing.value = false
      success.value = true
    }
  } catch (error) {
    console.log(error)
    processing.value = false
    success.value = false
    if (error.response.data.msg === 'invalid_link') {
      success.value = false
    }
  }
})

</script>