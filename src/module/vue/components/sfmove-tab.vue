<template>
  <div
    @click="$emit('click', property)"
    :class="['move-tab', 'clickable', 'block', 'nogrow', 'tab', 'flexrow', { selected: currentProperty === property }]"
  >
    <span>{{ title || $t('IRONSWORN.' + titleKey) }}</span>
    <btn-faicon class="nogrow" v-if="$listeners.delete" icon="fa fa-trash" @click="$emit('delete')" />
  </div>
</template>

<style lang="less">
.move-tab {
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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
