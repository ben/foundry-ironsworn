<template>
  <div class="box flexrow clickable block" @click="click">
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
  },

  computed: {
    i18nKey() {
      return `IRONSWORN.MoveContents.${this.move}.title`
    },
  },

  methods: {
    async click() {
      const move = await CONFIG.IRONSWORN.moveDataByName(this.move)
      CONFIG.IRONSWORN.RollDialog.show({ move, site: this.$actor() })
    },
  },
}
</script>
