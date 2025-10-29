<template>
  <div>
    <button @click="sent()">Enable Notifications</button>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '~/composables/useNotification'
const { sendNotification } = useNotification()

const sent = async () => {
  await sendNotification()
}

</script>
