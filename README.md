# Mobile Apps - Lesson 3 - Preparation - Axios + GitHub API

Here we will be using the **GitHub API** as a demonstration on how to make API requests using Axios in a **Vue3** application.

Some basic information can be fetched from GitHub at [https://api.github.com/users/BioBoost](https://api.github.com/users/BioBoost) where `BioBoost` can be replaced with any given valid username.

Feel free to test it out using browser/postman/insomnia.

## Getting Started

1. Start with Hello World

```bash
npm init vue@latest
```

2. Install axios

```bash
npm install axios
```

3. Create a new component called `GitHubProfile`. We'll start by hard coding some information in the template so we can have some output.
   1. Add view for the component
   2. Create route
   3. Add navigation to the route

```vue
<script setup lang="ts">
</script>

<template>
  <h1>BioBoost</h1>
  <div>
    <img href="https://avatars.githubusercontent.com/u/5863590?v=4" />
  </div>
  <ul>
    <li>Number of public repos: <strong>235</strong></li>
    <li>Number of followers: <strong>99</strong></li>
  </ul>
  <button>Visit GitHub page</button>
</template>
```

4. Let's start with a basic profile fetch
   1. First we create the axios call
   2. Second we display the info on the page

```vue
<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const profile = ref({})

// If using <script setup>,
// the presence of top-level await expressions automatically makes the component an async dependency.
axios.get('https://api.github.com/users/BioBoost')
.then((response) => {
  console.log(response.data)
  profile.value = response.data
})
.catch(() => {
  console.log("Failed to fetch the information")
})
</script>

<template>
  <div>
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
```

5. Bearer token so we do not get bounced. Go to `GitHub profile => Developer Settings => GitHub Apps => Personal Access Tokens`.
   1. For our current case we do not need to add extra permissions to the basic token

6. Demonstrate with Insomnia
   1. Make a GET request with an bearer token for authentication

7. Add token to axios request

```js
axios.get('https://api.github.com/users/BioBoost', {
  headers: {
    Authorization: `Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  }
})
```

8. Use env var

In `.env.local` file:

```
VITE_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

```js
// In setup:
const githubToken = import.meta.env.VITE_API_TOKEN;

// ...
axios.get('https://api.github.com/users/BioBoost', {
  headers: {
    Authorization: `Bearer ${githubToken}`
  }
})
```

This is not a safe option for private keys ! Never use it in that case. Requires server-side rendering or server-side app that authenticates.

9. Let's pass the username as a prop

```js
// In component setup
const props = defineProps({
  username: { type: String, required: true }
})

// ...
axios.get(`https://api.github.com/users/${props.username}`, {
  headers: {
    Authorization: `Bearer ${githubToken}`
  }
})
```

In the view we now need to pass in the username:

```vue
<git-hub-profile username="BioBoost" />
```

10. Add basic error handling. When we pass a username that is invalid we get an error from the API. Need to handle the error in a user friendly way.

```html
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
```

```js
const error = ref('')

// ...

.catch(() => {
  console.log("Failed to fetch the information")
  error.value = '... Failed to fetch user information ...'
})
```

11. Adding the API fetching like this in the component is not really good practice. Should abstract it away.
    1.  Create a sub dir in the `src` dir called `apis`
    2.  Now create a file called `github.ts`

```ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`
  }
});

const Users = {
  resource: 'users',

  get(username : String) {
    // This will return a promise !
    return api.get(`/${this.resource}/${username}`);
  }
}

export { Users }
```

```ts
import { ref } from 'vue'
import { Users } from '@/apis/github'

const props = defineProps({
  username: { type: String, required: true }
})

const profile = ref({})
const error = ref('')

// If using <script setup>,
// the presence of top-level await expressions automatically makes the component an async dependency.
Users.get(props.username)
.then((response) => {
  console.log(response.data)
  profile.value = response.data
})
.catch(() => {
  console.log("Failed to fetch the information")
  error.value = '... Failed to fetch user information ...'
})
```

12. Let's create a search component for the username

```vue
<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')

const search = function() {
  console.log(`Need to search for user ${username.value}`)
}
</script>

<template>
  <div>
    <input type="text" v-model="username" placeholder="username..." />
    <button @click="search">Search</button>
  </div>
</template>
```

You can place the component instance in the `GitHubView.vue` view.

13. Need to emit event when the user clicks the `search` button

```vue
<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['search'])

const username = ref('')

const search = function() {
  console.log(`Need to search for user ${username.value}`)
  emit('search', username.value);
}
</script>

<template>
  <div>
    <input type="text" v-model="username" placeholder="username..." />
    <button @click="search">Search</button>
  </div>
</template>
```

14. Now we catch the event in the parent component
    1.  We also need to define a reactive variable for the username so we can pass it to the profile component

```vue
<script setup lang="ts">
import { ref } from 'vue'
import GitHubProfile from '@/components/GitHubProfile.vue'
import UsernameSearch from '@/components/UsernameSearch.vue'

const username = ref('BioBoost')

const set_username = function(un : string) {
  console.log(`Getting username from search box ${un}`)
  username.value = un
}
</script>

<template>
  <div class="github">
    <username-search @search="set_username" />
    <git-hub-profile :username="username" />
  </div>
</template>
```

No reactivity. What gives ?

15. Well the username initialization value is passed as a prop and is used in the initial axios request resulting in the information of `BioBoost` being displayed. Problem is that when the `username` changes the call to the APi is not repeated.
    1.  Solution? Add watcher inside `GitHubProfile` component on `username`

```ts
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
```

Notice that we need to call the `fetch_info` function in setup itself too to populate the first user

* `toRefs()`: Converts a reactive object to a plain object where each property of the resulting object is a ref pointing to the corresponding property of the original object.

The secret is this: Component props IS reactive. As soon as you access a particular prop, it is NOT reactive. This process of dividing out or accessing a part of an object is referred to as "destructuring". In the new Composition API you need to get used to thinking about this all the time--it's a key part of the decision to use reactive() vs ref().

16. What is kinda weird is that we start with the `BioBoost` user, but we do not advertise this name in the search box. wE should pass the initial `username` to the `UsernameSearch` component.

In `UsernameSearch` we need to initialize the username with the prop value

```vue
<script setup lang="ts">
import { ref,toRefs, defineProps } from 'vue'

const props = defineProps({
  username : { type: String, default: '' }
})

const emit = defineEmits(['search'])

const username = ref(props.username)

const search = function() {
  console.log(`Need to search for user ${username.value}`)
  emit('search', username.value);
}
</script>

<template>
  <div>
    <input type="text" v-model="username" placeholder="username..." />
    <button @click="search">Search</button>
  </div>
</template>
```

In GitHubView we need to pass the `username` in

```vue
<script setup lang="ts">
import { ref } from 'vue'
import GitHubProfile from '@/components/GitHubProfile.vue'
import UsernameSearch from '@/components/UsernameSearch.vue'

const username = ref('BioBoost')

const set_username = function(un : string) {
  console.log(`Getting username from search box ${un}`)
  username.value = un
}
</script>

<template>
  <div class="github">
    <username-search @search="set_username" :username="username" />
    <git-hub-profile :username="username" />
  </div>
</template>
```

This is already becoming a bit complexer.

What we are actually doing here is manually creating a two-way binding.

17. Let's setup the two-way binding system by the books

In the `UsernameSearch` component we refactor as follows

```vue
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
```

Now we can just bind to model in `GitHubView`:

```vue
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
```

18. Last but not least we need a loading indication

```vue
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
```
