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
    {{ $t('IRONSWORN.' + titleKey) }}
  </div>
</template>

<script>
export default {
  props: {
    titleKey: String,
    property: String,
    currentProperty: String,
  },
}
</script>
