<template>
  <Suspense>
    <ChallengeResolutionDialog
      class="challenge-resolution-dialog"
      :message-id="data.messageId"
    >
      Loading…
    </ChallengeResolutionDialog>

    <template #fallback>
      <div class="flexrow">
        <loading-spinner />
      </div>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import ChallengeResolutionDialog from './challenge-resolution-dialog.vue'

const props = defineProps<{ data: { messageId: string } }>()
</script>
