<template>
  <div class="movesheet-row" :class="{ highlighted: move.highlighted }">
    <h4 class="flexrow" :title="tooltip">
      <btn-rollmove :hidden="!canRoll" :disabled="!canRoll" class="juicy text nogrow" :actor="actor" :move="move" />
      <span class="clickable text" @click="expanded = !expanded">
        {{ move.displayName }}
      </span>
    </h4>
    <transition name="slide">
      <with-rolllisteners element="div" class="move-summary" :actor="actor" v-if="expanded" @moveclick="moveclick">
        <div class="flexrow">
          <btn-rollmove v-if="canRoll" :actor="actor" :move="move">
            {{ $t('IRONSWORN.Roll') }}
          </btn-rollmove>
          <btn-sendmovetochat :move="move">
            {{ $t('IRONSWORN.Chat') }}
          </btn-sendmovetochat>
        </div>
        <div v-html="$enrichMarkdown(fulltext)" />
      </with-rolllisteners>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.move-summary {
  border-left: 2px solid;
  margin-left: 5px;
  padding-left: 1rem;
}
h4 {
  margin: 0;
  line-height: 1.4em;
}
.item-row {
  transition: all 0.4s ease;
}

.slide-enter-active,
.slide-leave-active {
  max-height: 1000px;
}
</style>

<script>
import BtnRollmove from './buttons/btn-rollmove.vue.js'
import BtnSendmovetochat from './buttons/btn-sendmovetochat.vue.js'
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
      const { Title, Page } = this.move.dataforgedMove?.Source ?? {}
      if (!Title) return undefined
      return `${Title} p${Page}`
    },
    fulltext() {
      return this.move.moveItem?.data?.data?.Text
    },
    canRoll() {
      return CONFIG.IRONSWORN.SFRollMoveDialog.moveHasRollableOptions(this.move.moveItem)
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
    moveclick(item) {
      this.$emit('moveclick', item)
    },
    collapse() {
      this.expanded = false
    },
  },
  components: { BtnRollmove, BtnSendmovetochat },
}
</script>
