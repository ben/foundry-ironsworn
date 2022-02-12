<template>
  <div class="flexrow clickable block nogrow" @click="click" :title="tooltip">
    <i :class="classes"></i>
  </div>
</template>

<script>
export default {
  props: {
    icon: { type: String, required: true },
    solid: { type: Boolean, default: true },
    tooltip: String
  },

  computed: {
    classes() {
      return {
        fas: this.solid,
        far: !this.solid,
        [`fa-${this.icon}`]: true,
      }
    },
  },

  methods: {
    click(event) {
      return this.$emit('click', event)
    },
  },
}
</script>

<style lang="less" scoped>
div {
  align-content: center;
  text-align: center;
  justify-content: center;
}
i {
  padding: 3px;
  width: 22px;
}
</style>
