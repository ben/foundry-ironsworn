<template>
  <btn-faicon
    icon="fire"
    class="burn-momentum"
    @click="burnMomentum"
    :disabled="disabled"
  >
    <slot></slot>
  </btn-faicon>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { IronswornActor } from '../../../actor/actor'
import btnFaicon from './btn-faicon.vue'

defineProps({
  disabled: Boolean,
})
const $actor = inject('$actor') as IronswornActor

const burnMomentum = () => $actor.burnMomentum()
</script>
