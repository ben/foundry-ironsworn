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
      v-if="$listeners.delete"
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

<script>
export default {
  props: {
    title: String,
    titleKey: String,
    property: String,
    currentProperty: String,
  },
}
</script>
