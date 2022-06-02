<template>
  <article class="expandable" :id="articleId" :aria-expanded="isExpanded">
    <header>
      <h1>
        <icon-button
          :aria-controls="contentId"
          :id="buttonId"
          class="expand-toggle"
          :icon="caret"
          :tooltip="tooltip"
          @click="isExpanded = !isExpanded"
        >
          {{ title }}
        </icon-button>
      </h1>
      <slot name="header-extras"></slot>
    </header>
    <transition
      :aria-labelledby="buttonId"
      :aria-expanded="isExpanded"
      name="slide"
      :id="contentId"
      class="expand-content"
    >
      <slot v-if="isExpanded"></slot>
    </transition>
  </article>
</template>

<style lang="less">
// see expandable.vue for base styles
.expandable {
  header {
    display: flex;
    flex-flow: row nowrap;
    h1 {
      display: contents;
      font-size: var(--font-size-16);
    }
  }
}
</style>

<script>
export default {
  props: {
    baseId: String, // id used to derive the ids used by the button and collapsed content for aria annotation
    title: String,
    startOpen: { type: Boolean, default: false },
    tooltip: String,
  },
  data() {
    return {
      isExpanded: this.startOpen,
    }
  },
  computed: {
    caret() {
      return this.isExpanded ? 'caret-down' : 'caret-right'
    },
    articleId() {
      return `article-${this.baseId}`
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
