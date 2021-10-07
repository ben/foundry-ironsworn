<template>
  <div class="boxgroup">
    <div class="flexrow boxrow">
      <boxrow-box
        v-for="(item, i) in items"
        :key="i"
        v-bind="item"
        @click="click"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    min: Number,
    max: Number,
    current: Number,
  },

  computed: {
    items() {
      const ret = []
      for (let i = this.min; i <= this.max; i++) {
        ret.push({
          text: `${i > 0 ? '+' : ''}${i}`,
          value: i,
          selected: i === this.current,
        })
      }
      return ret
    },
  },

  methods: {
    click(el, value) {
      this.$emit('click', el, value)
    },
  },
}
</script>

