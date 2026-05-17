<template>
  <div class="w-full h-screen flex justify-center items-center">
    <div class="w-64 flex flex-col justify-center items-center">
      <h1 class="text-3xl font-semibold mb-6 dark:text-neutral-200">
        Welcome
      </h1>

      <!-- Sign in with Google -->
      <p class="text-sm font-light text-neutral-500 dark:text-neutral-500">
        Sign in using
      </p>
      <GoogleSignIn />

      <!-- Sign with email -->
      <div class="mt-8">
        <p class="text-sm text-center font-light text-neutral-500">
          Or sign in with your email
        </p>
        <Form ref="form" class="mt-2">
          <p class="dark:text-neutral-200">Email</p>
          <FormTextField 
            size="w-full h-10"
            class="mb-4"
            v-model="email"
            :validator='[required]'
            placeholder="Enter your email address"
          />
          <p class="dark:text-neutral-200">Password</p>
          <FormTextField 
            type='password'
            size="w-full h-10"
            v-model="password"
            :validator='[required]'
            placeholder="Enter your password"
          />
        </Form>
      </div>

      <p class="mt-3 text-sm text-center whitespace-pre-wrap text-red-500">{{ errorMsg }}</p>

      <Button1 name="Sign in" class="mt-6" @click="signIn()" />
      <div class="flex text-sm mt-4">
        <p class="mr-1 dark:text-neutral-400">
          Don't have an account yet?
          <span 
            class="text-secondary-400 dark:text-secondary-500 cursor-pointer" 
            @click="router.push('/sign-up')"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { required, minLength, validEmail, validPassword } from "~~/composables/validator"
import { useAuthStore } from "~~/stores/AuthStore"
import axios from 'axios'

const router = useRouter()

const email = ref('')
const password = ref('')
const form = ref()

const errorMsg = ref('')

const authStore = useAuthStore()
const signIn = async () => {
  if (form.value.validate()) {
    try {
      await authStore.signIn(email.value, password.value)
      router.push('/app/decks')
    } catch (error) {
      if (error.response.data.msg === 'invalid_credentials') {
        errorMsg.value = "Incorrect email or password.\nPlease try again."
      } else if (error.response.data.msg === 'email_not_verified') {
        errorMsg.value = "Please verify your email using the link that has been sent to your email."
      } else {
        errorMsg.value = error.response.data.msg
      }
    }
  }
}

onMounted(() => {
  const authStore = useAuthStore()
  if (authStore.user) {
    router.push('/app/dashboard')
  }
})
</script>