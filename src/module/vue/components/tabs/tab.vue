<template>
  <div class="tab flexcol" v-show="selectedTitle === title">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const selectedTitle = inject('selectedTitle')
</script>
