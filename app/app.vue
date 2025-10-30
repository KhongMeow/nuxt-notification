<template>
  <div>
    <button @click="sent()">Enable Notifications</button>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '~/composables/useNotification'
const { sendNotification, requestPermission } = useNotification()

function sent() {
  sendNotification('New Message', {
    body: "Meow.............!",
    tag: 'chat-message',
  })
}

</script>
