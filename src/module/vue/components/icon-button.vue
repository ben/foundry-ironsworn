<template>
  <button :class="classes" type="button" @click="click" :title="tooltip" :v-text="textContent">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    icon: { type: String, required: true },
    solid: { type: Boolean, default: true },
    tooltip: String,
    textContent: String,
  },

  computed: {
    classes() {
      return {
        fas: this.solid,
        far: !this.solid,
        [`fa-${this.icon}`]: true,
        ['icon-button']: true,
        clickable: true,
        block: true,
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

<style lang="less">
@import '../../../styles/mixins.less';
.icon-button {
  border: none;
  flex-grow: 0;
  background: none;
  align-content: center;
  text-align: center;
  justify-content: center;
  padding: 3px;
  width: 22px;
}
</style>
