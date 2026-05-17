<template>
  <div class="w-full h-screen flex justify-center items-center">
    <!-- Confirming account -->
    <div v-if="confirming" class="w-96 flex flex-col justify-center items-center">
      <CheckCircleIcon class="mx-auto w-20 h-20 fill-green-500"/>
      <p class="mt-5 text-2xl text-center dark:text-neutral-200">
        A verification link has been sent to your email.
      </p>
      <p class="text-lg text-center mt-5 text-neutral-600 dark:text-neutral-400">
        Please click on the verification link to complete the account registration.
      </p>
    </div>

    <!-- Signing up account !-->
    <div v-else class="w-72 flex flex-col justify-center items-center">
      <p class="text-2xl text-center font-semibold dark:text-neutral-200">
        Start your flashlearn journey today!
      </p>

      <div class="mx-auto mt-6">
        <Form ref="form">
          <p class="dark:text-neutral-200">Email</p>
          <FormTextField 
              class="mb-4"
              size='w-full h-9'
              v-model="email"
              :validator='[required, validEmail]'
              placeholder="e.g john_doe@email.com"
          />
          <p class="dark:text-neutral-200">Username</p>
          <FormTextField 
            class="mb-4"
            size='w-full h-9'
            v-model="username"
            :validator='[required, maxLength(20)]'
            placeholder="e.g John Doe"
          />  
          <p class="dark:text-neutral-200">Password</p>
          <FormTextField 
              class="mb-4"
              type='password'
              size='w-full h-9'
              v-model="password"
              :validator='[required, minLength(8), validPassword]'
              placeholder="********"
          />
          <p class="dark:text-neutral-200">Confirm password</p>
          <FormTextField 
              type='password'
              size='w-full h-9'
              v-model="re_password"
              :validator='[required, checkMatch(password)]'
              placeholder="********"
          />
        </Form>
      </div>

      <p class="mt-3 text-sm text-center whitespace-pre-wrap text-red-500">{{ errorMsg }}</p>
      
      <Button1 class="mt-6" name="Create account" @click="signUp()" />

      <div class="text-sm mt-4 flex items-center justify-center">
        <p class="mr-1 dark:text-neutral-400">
          Already have an account?
          <span 
            class="text-secondary-400 dark:text-secondary-500 cursor-pointer" 
            @click="router.push('/sign-in')"
          >
            Sign in!
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckCircleIcon } from "@heroicons/vue/24/solid"
import { required, minLength, validEmail, validPassword, checkMatch } from "~~/composables/validator"
import axios from 'axios'
import { useAuthStore } from "~~/stores/AuthStore"

const config = useRuntimeConfig()
const form = ref()

const email = ref('')
const username = ref('')
const password = ref('')
const re_password = ref('')
const confirming = ref(false)
const router = useRouter()

const errorMsg = ref('')

const authStore = useAuthStore()
const signUp = async () => {
  if (form.value.validate()) {
    try {
      await authStore.register(username.value, email.value, password.value)
      confirming.value = true
    } catch (error) {
      console.log(error)
      if (error.response.data.msg === 'email_taken') {
        errorMsg.value = `The email ${email.value} is already taken.`
      } else if (error.response.data.msg === 'username_taken') {
        errorMsg.value = `The username ${username.value} is already taken.`
      } else {
        errorMsg.value = error.response.data.msg
      }
    }
  }
}
</script>