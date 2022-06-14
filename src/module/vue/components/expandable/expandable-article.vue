<template>
  <article class="expandable" :id="articleId" :aria-expanded="isExpanded">
    <header>
      <h1>
        <faicon-button
          :aria-controls="contentId"
          :id="buttonId"
          class="expand-toggle"
          :icon="icon"
          :tooltip="tooltip"
          :aria-expanded="isExpanded"
          @click="isExpanded = !isExpanded"
        >
          {{ title }}
          <span class="subtitle" v-if="!!subtitle">{{ subtitle }}</span>
        </faicon-button>
      </h1>
      <slot name="headercontent"></slot>
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
    <transition :aria-expanded="isExpanded" name="slide" class="expand-content">
      <slot name="footer" v-if="isExpanded"> </slot>
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
    subtitle: String,
    startExpanded: { type: Boolean, default: false },
    tooltip: String,
    withIcon: { type: Boolean, default: true },
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
      if (this.withIcon === true) {
        return this.isExpanded ? this.iconExpanded : this.iconClosed
      } else {
        return undefined
      }
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
