<template>
  <div class="tab flexcol" v-show="selectedTitle === title">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'

const props = defineProps<{ title: string; icon?: string }>()

const selectedTitle = inject('selectedTitle')
</script>
