<!-- articles are standalone, therefore they can have their own independent header hierarchy

    spec here: https://html.spec.whatwg.org/multipage/sections.html#the-article-element

    its examples include some articles with self-contained h1s, so i guess that is the intent!

    not sure how well assistive tech handles it in practice, tho.
    TODO: research whether this would benefit from add'l aria annotation
  -->
<template>
  <article class="move-text" :class="{ highlighted: move.highlighted }">
    <header>
      <isicon-button icon="d10-tilt" @click="rollMove"> </isicon-button>
      <button type="button" @click="rollMove">
        <h1 class="h4 clickable text move-title" :title="tooltip">
          {{ move.displayName }}
        </h1>
      </button>
      <icon-button icon="eye" @click="expanded = !expanded" />
    </header>
    <transition name="slide">
      <ul class="move-category-list">
        <with-rolllisteners v-if="expanded" element="div" class="move-summary" :actor="actor" @moveclick="moveclick">
          <div v-html="$enrichMarkdown(fulltext)" />
        </with-rolllisteners>
      </ul>
    </transition>
  </article>
</template>

<style lang="less">
@import '../../../styles/fonts.less';
@import '../../../styles/mixins.less';
.move-text {
  overflow-x: hidden;
  header {
    .flexrow();
    border: 1px solid;
    flex-wrap: nowrap;
    .move-title {
      .text-heading();
      background: unset;
      font-weight: bold;
      line-height: 30px;
      margin: 0;
      padding: 0;
      text-align: start;
      border: none;
    }
    button {
      border: none;
      background: none;
    }
    .icon-button {
      flex-grow: 0;
    }
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    move: Object,
  },

  data() {
    return {
      expanded: false,
    }
  },

  computed: {
    tooltip() {
      // TODO: page number, when it shows up
      return this.move.dataforgedMove?.Source?.Title
    },

    fulltext() {
      return this.move.moveItem?.data?.data?.Text
    },
  },

  watch: {
    'move.highlighted': async function (value) {
      if (value) {
        this.expanded = true
        await new Promise((r) => setTimeout(r, 200))
        this.$el.scrollIntoView()
      }
    },
  },

  methods: {
    async rollMove() {
      CONFIG.IRONSWORN.SFRollMoveDialog.show(this.$actor, this.move.moveItem)
    },

    moveclick(item) {
      this.$emit('moveclick', item)
    },

    collapse() {
      this.expanded = false
    },
  },
}
</script>
