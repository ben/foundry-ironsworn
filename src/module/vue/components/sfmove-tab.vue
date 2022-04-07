<template>
  <div
    @click="$emit('click', property)"
    :class="[
      'clickable',
      'block',
      'nogrow',
      'tab',
      { selected: currentProperty === property },
    ]"
  >
    {{ title || $t('IRONSWORN.' + titleKey) }}
  </div>
</template>

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
