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
    <IronBtn
      nogrow
      block
      v-if="$attrs.onDelete"
      icon="fa:trash"
      @click="$emit('delete')"
    />
  </div>
</template>

<style lang="less" scoped>
span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<script setup lang="ts">
import IronBtn from './buttons/iron-btn.vue'

const props = defineProps<{
  title?: string
  titleKey?: string
  property: string
  currentProperty: string
}>()

defineEmits<{ (e: 'click', property: string) }>()
</script>
