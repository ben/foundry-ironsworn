<template>
  <span class="nogrow" @click="$emit('click')"></span>
</template>

<style lang="less" scoped>
span {
  flex-basis: 16px;
  flex-grow: 0;
  display: inline-block;
  margin-right: 3px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  background-image: url('systems/foundry-ironsworn/assets/d10v4.svg');
  background-size: 16px 16px;
  background-repeat: no-repeat;
  transform: scale(1.3);
}
</style>
