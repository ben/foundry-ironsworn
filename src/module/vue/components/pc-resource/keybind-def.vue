<template>
  <dl class="keybind-definitions-list">
    <div class="keybind-definition" v-for="item in keybindData">
      <dt v-for="key in item.keys">
        <kbd>{{ key }}</kbd>
      </dt>
      <dd>{{ item.description }}</dd>
    </div>
  </dl>
</template>
<style lang="less"></style>
<script lang="ts" setup>
import { computed } from 'vue'

interface KeybindData {
  keys: (string | number)[]
  fn: (event: KeyboardEvent) => void
  description: string
}

const props = defineProps<{
  keybindData: KeybindData[]
}>()
</script>
