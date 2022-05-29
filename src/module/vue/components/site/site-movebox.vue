<template>
  <div class="box flexrow clickable block" :class="{ disabled: disabled }" @click="click">
    <h4 class="nogrow" style="margin: 0; white-space: nowrap">
      {{ $t(i18nKey) }}
    </h4>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
    move: String,
    disabled: Boolean,
  },

  computed: {
    i18nKey() {
      return `IRONSWORN.MoveContents.${this.move}.title`
    },
  },

  methods: {
    async click() {
      if (this.disabled) return
      const move = await CONFIG.IRONSWORN.moveDataByName(this.move)
      CONFIG.IRONSWORN.RollDialog.show({ move, site: this.$actor })
    },
  },
}
</script>
