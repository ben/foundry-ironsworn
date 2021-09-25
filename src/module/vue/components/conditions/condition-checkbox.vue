<template>
  <label class="checkbox">
    <input type="checkbox" :checked="checked" />
    {{ $t(`IRONSWORN.${$capitalize(name)}`) }}
  </label>
</template>

<script>
export default {
  props: {
    actor: Object,
    name: String,
  },

  computed: {
    checked() {
      return this.actor.data.debility[this.name]
    },
  },
}
</script>
