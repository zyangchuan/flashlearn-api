<template>
  <div>
    <a :href="getGoogleUrl()">
      <div class="w-48 h-10 mt-2 shadow border-neutral-400 border-[1px] cursor-pointer transition duration-300 dark:border-0 dark:bg-neutral-800 flex justify-center items-center rounded-lg">
        <img src="@/assets/google_logo.png" class="w-4 h-4 mr-2" alt="">
        <p class="text-md dark:text-neutral-300">Google</p>
      </div>
    </a>
  </div>
</template>

<script setup>
import axios from 'axios'
const route = useRoute();
const config = useRuntimeConfig()

const getGoogleUrl = () => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

  const options = {
    redirect_uri: config.GOOGLE_REDIRECT_URL,
    client_id: config.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    scope:
      'https://www.googleapis.com/auth/userinfo.profile ' + 
      'https://www.googleapis.com/auth/userinfo.email',
    include_granted_scopes: 'true',
    state: 'google_sign_in',
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};
</script>