<template>
  <btn-faicon
    icon="fire"
    class="burn-momentum"
    @click="burnMomentum"
    :disabled="disabled"
  >
    <slot name="default"></slot>
  </btn-faicon>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { $ActorKey } from '../../provisions'
import btnFaicon from './btn-faicon.vue'

defineProps<{ disabled?: boolean }>()
const $actor = inject($ActorKey)

const burnMomentum = () => $actor?.burnMomentum()
</script>
