<template>
  <div>
    <button @click="sent()">Enable Notifications</button>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '~/composables/useNotification'
const { sendNotification, requestPermission } = useNotification()

async function sent() {
  await sendNotification('New Message', {
    body: "Meow.............!",
    tag: 'chat-message',
  })
}

</script>
