<script setup lang="ts">
import { toRefs, ref, watch } from 'vue'
import { Users } from '@/apis/github'

const props = defineProps({
  username: { type: String, required: true }
})

const profile = ref({})
const error = ref('')

const fetch_info = function() {
  Users.get(props.username)
  .then((response) => {
    console.log(response.data)
    profile.value = response.data
  })
  .catch(() => {
    console.log("Failed to fetch the information")
    error.value = '... Failed to fetch user information ...'
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