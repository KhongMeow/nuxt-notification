<template>
  <div>
    <button @click="sent()">Enable Notifications</button>
  </div>
</template>

<script setup lang="ts">
import { enableNotifications } from '~/composables/useNotification'

let count = 0
async function sent() {
  await enableNotifications();
}

</script>
