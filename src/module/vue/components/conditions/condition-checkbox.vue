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
  },

  methods: {
    input(ev) {
      const actor = game.actors?.get(this.actor._id)
      let numDebilitiesMarked =
        Object.values(this.actor.data.debility).filter((x) => x).length +
        (ev.currentTarget.checked ? 1 : -1)
      actor.update({
        data: {
          debility: {
            [this.name]: ev.currentTarget.checked,
          },
          momentumMax: 10 - numDebilitiesMarked,
          momentumReset: Math.max(0, 2 - numDebilitiesMarked),
        },
      })
    },
  },
}
</script>
