<template>
  <div style="display:flex; gap:12px; align-items:center; padding:16px;">
    <button @click="enable" :disabled="busy">
      {{ busy ? 'Working…' : 'Enable Notifications' }}
    </button>
    <button @click="send" :disabled="busy">
      Send Test Notification
    </button>
    <small v-if="message">{{ message }}</small>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '~/composables/useNotification'

const { sendNotification, requestPermission, registerSW, isSupported } = useNotification()
const busy = ref(false)
const message = ref('')

onMounted(() => {
  if (isSupported()) {
    registerSW().catch(() => {})
  } else {
    message.value = 'Notifications not supported in this browser.'
  }
})

async function enable() {
  message.value = ''
  busy.value = true
  try {
    await requestPermission()
    message.value = 'Notifications enabled.'
  } catch (e: any) {
    message.value = e?.message || 'Failed to enable notifications.'
  } finally {
    busy.value = false
  }
}

async function send() {
  message.value = ''
  busy.value = true
  try {
    await sendNotification('New Message', {
      body: 'Meow.............!',
      tag: 'chat-message',
      data: { url: '/' },
    })
    message.value = 'Notification sent.'
  } catch (e: any) {
    message.value = e?.message || 'Failed to send notification.'
  } finally {
    busy.value = false
  }
}
</script>
