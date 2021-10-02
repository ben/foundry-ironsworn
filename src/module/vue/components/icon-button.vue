<template>
  <div class="clickable block nogrow" @click="click">
    <i :class="$concat('fas fa-', icon)"></i>
  </div>
</template>

<script>
export default {
  props: {
    icon: { type: String, required: true },
  },

  methods: {
    click(event) {
      return this.$emit('click', event)
    },
  },
}
</script>

<style lang="less" scoped>
i {
  padding: 3px;
  width: 22px;
  text-align: center;
}
</style>
