<template>
  <BtnRollmove :move="move" :disabled="disabled" class="box juicy text block">
    {{ move?.displayName }}
  </BtnRollmove>
</template>

<script lang="ts" setup>
import { Move } from '../../../features/custommoves'
import BtnRollmove from '../buttons/btn-rollmove.vue'

defineProps<{ move?: Move; disabled?: boolean }>()
</script>
