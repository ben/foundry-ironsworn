<template>
  <label class="checkbox">
    <input
      type="checkbox"
      @change="input"
      :checked="actor.data.debility[name]"
    />
    {{ $t(`IRONSWORN.${$capitalize(name)}`) }}
  </label>
</template>

<script>
export default {
  props: {
    actor: Object,
    name: String,
    global: Boolean,
  },

  methods: {
    async input(ev) {
      const actor = game.actors?.get(this.actor._id)
      const value = ev.currentTarget.checked
      let numDebilitiesMarked =
        Object.values(this.actor.data.debility).filter((x) => x).length +
        (value ? 1 : -1)
      await actor.update({
        data: {
          debility: {
            [this.name]: value,
          },
          momentumMax: 10 - numDebilitiesMarked,
          momentumReset: Math.max(0, 2 - numDebilitiesMarked),
        },
      })
      if (this.global) {
        await CONFIG.IRONSWORN.IronswornSettings.maybeSetGlobalCondition(
          this.name,
          value
        )
      }
    },
  },
}
</script>
