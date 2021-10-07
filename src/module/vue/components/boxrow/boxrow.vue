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
    items: {
      type: Array,
      validator(val) {
        return val.every((x) => x?.text !== undefined && x?.value !== undefined)
      },
    },
  },

  methods: {
    click(el, value) {
      this.$emit('click', el, value
      )
    }
  }
}
</script>

