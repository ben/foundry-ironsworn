<template>
  <ul class="move-leaf-list">
    <li class="move-leaf" role="treeitem" v-for="move of moves" :key="move.$id">
      <move-leafcontent :actor="actor" :move="move"> </move-leafcontent>
    </li>
  </ul>
</template>

<style lang="less"></style>

<script>
export default {
  props: {
    actor: Object,
    moves: Array,
  },
}
</script>
