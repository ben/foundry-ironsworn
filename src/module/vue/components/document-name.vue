<template>
  <h1 class="charname">
    <input
      :placeholder="$t('IRONSWORN.Name')"
      v-model="document.name"
      name="name"
      type="text"
    />
  </h1>
</template>

<script>
export default {
  props: {
    document: Object,
  },

  methods: {
    save() {
      const document = this.$item ?? this.$actor
      document?.update({ name: this.document.name })
    },
  },
}
</script>
