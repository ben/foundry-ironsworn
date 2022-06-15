<template>
  <component :is="tag" class="charname">
    <input
      :placeholder="$t('IRONSWORN.Name')"
      v-model="document.name"
      name="name"
      type="text"
    />
  </component>
</template>

<script>
export default {
  props: {
    document: Object,
    tag: {
      type: String,
      default: 'h1',
    },
  },

  methods: {
    save() {
      const document = this.$item ?? this.$actor
      document?.update({ name: this.document.name })
    },
  },
}
</script>
