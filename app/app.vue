<template>
  <div>
    <button @click="sent()">Enable Notifications</button>
  </div>
</template>

<script setup lang="ts">
import { sendNotification } from '~/composables/useNotification'

let count = 0
async function sent() {
  await sendNotification('New Message', {
    body: `Meow.............!`,
    tag: 'chat-message',
  })
}

</script>
