<template>
  <div
    @click="click"
    :class="classes"
    :data-resource="stat"
    :data-value="value"
  >
    {{ valueStr }}
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
    stat: String,
    value: Number,
    softMax: Number,
  },
  computed: {
    classes() {
      return {
        clickable: true,
        block: true,
        'stack-row': true,
        [this.stat]: true,
        selected: this.selected,
        disabled: this.disabled,
      }
    },
    valueStr() {
      return this.value > 0 ? `+${this.value}` : this.value.toString()
    },
    current() {
      return this.actor.data[this.stat]
    },
    selected() {
      return this.current === this.value
    },
    disabled() {
      return this.value > this.softMax
    },
  },

  methods: {
    click(event) {
      const actor = game.actors?.get(this.actor._id)
      actor?.update({ data: { [this.stat]: this.value } })
      if (this.stat === 'supply') {
        CONFIG.IRONSWORN.IronswornSettings.maybeSetGlobalSupply(this.value)
      }
    },
  },
}
</script>
