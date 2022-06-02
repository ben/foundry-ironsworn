<template>
  <ul class="move-tree" role="tree">
    <li v-for="category of categories" class="expandable" :key="category.$id" role="treeitem group">
      <expandable-article :baseId="`${actor._id}-${category.$id}`" class="move-category" :title="category.displayName">
        <template v-slot:header-extras> </template>
        <move-leaflist :moves="category.moves" :actor="actor"></move-leaflist>
      </expandable-article>
    </li>
  </ul>
</template>

<style lang="less">
.move-tree {
  margin: 0;
  padding: 0;
  .expand-toggle {
    text-transform: uppercase;
    border: 0;
  }
  .move-category {
    header {
    }
  }
  .move {
    .expand-toggle {
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: var(--font-size-14);
    }
  }
  .move-leaf-list {
    margin: 0;
    padding: 0;
    .move-leaf {
      margin-left: 1rem;
    }
  }
}
</style>

<script>
export default {
  props: {
    categories: Array,
    actor: Object,
  },
  methods: {
    moveclick(item) {
      this.$emit('moveclick', item)
    },
  },
}
</script>
