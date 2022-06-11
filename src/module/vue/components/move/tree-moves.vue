<template>
  <ul class="move-tree" role="tree">
    <li
      v-for="category of categories"
      class="expandable"
      :class="classes(category)"
      :key="category.$id"
      role="treeitem group"
    >
      <expandable-article :baseId="`${actor._id}-${category.$id}`" class="move-category" :title="category.displayName">
        <move-leaflist :moves="category.moves" :actor="actor"></move-leaflist>
      </expandable-article>
    </li>
  </ul>
</template>

<style lang="less">
.move-tree {
  margin: 0;
  padding: 0;
  gap: 0.25rem;
  display: flex;
  flex-flow: column nowrap;
  button.expand-toggle {
    text-transform: uppercase;
  }
  .move-category {
    border-color: var(--theme-color);
    background-color: var(--theme-color);
    border-radius: 5px;
    border-width: 2px;
    overflow: clip;
    & > header {
      color: #fff;
      button.expand-toggle {
        border: 0;
        color: #fff;
      }
    }
    .move-leaf-list {
      margin: 0;
      padding: 0;
    }
  }
  .move-leaf {
    .move-leaf-content[aria-expanded='true'] {
      overflow: clip;
    }
    &:not(:first-child) {
      .move-leaf-content[aria-expanded='true'] {
        margin-top: 2px;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
      }
    }
    &:not(:last-child) {
      .move-leaf-content[aria-expanded='true'] {
        margin-bottom: 2px;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
      }
    }
  }
  .move-leaf-content {
    background: #fff;
    header {
      button.expand-toggle {
        font-family: var(--font-heading);
        font-weight: 700;
        font-size: var(--font-size-14);
      }
    }

    &[aria-expanded='true'] {
      header,
      footer {
        color: #fff;
        background: #000;
        button {
          color: #fff;
        }
      }
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
    classes(category) {
      // console.log(category)
      return `move-${category.displayName.toLowerCase().replaceAll(' ', '-')}`
    },
    moveclick(item) {
      this.$emit('moveclick', item)
    },
  },
}
</script>
