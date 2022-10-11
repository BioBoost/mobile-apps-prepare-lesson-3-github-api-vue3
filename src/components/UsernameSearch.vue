<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'

const props = defineProps({
  // 2-way binding using a model
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const username = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Still need this for the text box
const inputUsername = ref(props.modelValue)

// We need this for the search because we have the button interaction
const search = function() {
  console.log(`Need to search for user ${inputUsername.value}`)
  username.value = inputUsername.value
}
</script>

<template>
  <div>
    <input type="text" v-model="inputUsername" placeholder="username..." />
    <button @click="search">Search</button>
  </div>
</template>