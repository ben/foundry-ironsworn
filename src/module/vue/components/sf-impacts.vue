<template>
  <div class="flexrow">
    <div class="flexcol">
      <h4>Misfortunes</h4>
    </div>
    <div class="flexcol">
      <h4>Lasting Effects</h4>
    </div>
    <div class="flexcol">
      <h4>Burdens</h4>
    </div>
    <div class="flexcol">
      <h4>Vehicle</h4>
    </div>
  </div>
</template>

<style lang="less" scoped>
h4 {
  text-align: center;
}
</style>

<script>
export default {
  props: {
    actor: Object,
  },
}
</script>
