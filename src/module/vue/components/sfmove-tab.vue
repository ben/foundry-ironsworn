<template>
  <div
    @click="$emit('click', property)"
    :class="[
      'clickable',
      'block',
      'nogrow',
      'tab',
      'flexrow',
      { selected: currentProperty === property },
    ]"
  >
    <span>{{ title || $t('IRONSWORN.' + titleKey) }}</span>
    <btn-faicon
      class="nogrow block"
      v-if="$attrs.onDelete"
      icon="trash"
      @click="$emit('delete')"
    />
  </div>
</template>

<style lang="less" scoped>
span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<script setup lang="ts">
import BtnFaicon from './buttons/btn-faicon.vue'

const props = defineProps<{
  title?: string
  titleKey?: string
  property: string
  currentProperty: string
}>()

defineEmits<{ (e: 'click', property: string) }>()
</script>
