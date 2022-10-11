<script setup lang="ts">
import { ref } from 'vue'
import GitHubProfile from '@/components/GitHubProfile.vue'
import UsernameSearch from '@/components/UsernameSearch.vue'

const username = ref('BioBoost')
</script>

<template>
  <div class="github">
    <username-search v-model="username" />
    <git-hub-profile :username="username" />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .github {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
