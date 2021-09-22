<template>
  <div
    @click="click"
    :class="
      $concat(
        'clickable block stack-row ironsworn__stat__value ',
        stat,
        selected,
        disabled
      )
    "
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
    valueStr() {
      return this.value > 0 ? `+${this.value}` : this.value.toString()
    },
    current() {
      return this.actor.data[this.stat]
    },
    selected() {
      return this.current === this.value ? ' selected ' : ''
    },
    disabled() {
      return this.value > this.softMax ? ' disabled ' : ''
    },
  },

  methods: {
    click(event) {
      const actor = game.actors?.get(this.actor._id)
      actor?.update({data: {[this.stat]: this.value}})
    }
  }
}
</script>
