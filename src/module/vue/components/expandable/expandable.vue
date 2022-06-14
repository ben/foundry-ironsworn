<!-- if the wrapperTag here is an article, consider using expandable-article instead - it allows headings, etc -->

<template>
  <component :is="wrapperTag" class="expandable" :aria-expanded="isExpanded">
    <faicon-button
      :aria-controls="contentId"
      :id="buttonId"
      class="expand-toggle"
      :icon="icon"
      @click="isExpanded = !isExpanded"
    >
      {{ buttonText }}
    </faicon-button>
    <transition-group
      :aria-labelledby="buttonId"
      :aria-expanded="isExpanded"
      name="slide"
      :id="contentId"
      class="expand-content"
      :class="transitionGroupClasses"
      :tag="transitionGroupTag"
    >
      <slot v-if="isExpanded"></slot>
    </transition-group>
  </component>
</template>

<style lang="less">
.expandable {
  display: flex;
  flex-flow: column nowrap;

  li[role^='treeitem'],
  li[role*=' treeitem'] {
    list-style: none;
    .expand-toggle {
      border: 0;
    }
  }
  .expand-toggle {
    flex-grow: 1;
    justify-content: flex-start;
    line-height: 1;
    &::before {
      width: 0.75em;
    }
  }
  .expand-content {
  }
}
</style>

<script>
export default {
  props: {
    baseId: String, // id used to derive the ids used by the button and collapsed content for aria annotation
    transitionGroupTag: { type: String, default: 'section' },
    transitionGroupClasses: {
      type: String,
      default: '',
    },
    wrapperTag: { type: String, default: 'section' },
    buttonText: String,
    startExpanded: { type: Boolean, default: false },
    iconExpanded: { type: String, default: 'caret-down' },
    iconClosed: { type: String, default: 'caret-right' },
  },
  data() {
    return {
      isExpanded: this.startExpanded,
    }
  },
  computed: {
    icon() {
      return this.isExpanded ? this.iconExpanded : this.iconClosed
    },
    buttonId() {
      return `button-${this.baseId}`
    },
    contentId() {
      return `content-${this.baseId}`
    },
  },
}
</script>
