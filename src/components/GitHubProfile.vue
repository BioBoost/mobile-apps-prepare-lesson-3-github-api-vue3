<script setup lang="ts">
import { toRefs, ref, watch } from 'vue'
import { Users } from '@/apis/github'

const props = defineProps({
  username: { type: String, required: true }
})

const profile = ref({})
const error = ref('')
const loading = ref(false)

const fetch_info = function() {
  loading.value = true;
  Users.get(props.username)
  .then((response) => {
    console.log(response.data)
    profile.value = response.data
    loading.value = false;
  })
  .catch(() => {
    console.log("Failed to fetch the information")
    error.value = '... Failed to fetch user information ...'
    loading.value = false;
  })
}
fetch_info();       // Initial Fetch!

// Need to watch username for changes.
// However cannot watch props.username directly
const username = toRefs(props).username;
watch(username, async (newUsername, oldUsername) => {
  fetch_info();
})
</script>

<template>
  <div v-if="error">
    Failed to get profile.
  </div>
  <div v-else-if="loading">
    ... Loading the requested profile ...
  </div>
  <div v-else>
    <h1>{{ profile.login }}</h1>
    <div>
      <img :href="profile.avatar_url" />
    </div>
    <ul>
      <li>Number of public repos: <strong>{{ profile.public_repos }}</strong></li>
      <li>Number of followers: <strong>{{ profile.followers }}</strong></li>
    </ul>
    <button>Visit GitHub page</button>
  </div>
</template>