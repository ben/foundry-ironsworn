<template>
  <expandable-article
    class="move move-leaf-content"
    :title="move.displayName"
    :subtitle="isProgressMove ? 'Progress Move' : undefined"
    :baseId="`${actor._id}-${move.moveItem.id}`"
    :tooltip="toggleTooltip"
    :withIcon="false"
  >
    <div class="move-buttons" slot="headercontent">
      <btn-moveroll
        :move="move"
        v-if="triggerOptions.length > 0"
        :tooltip="`Make ${isProgressMove ? 'a progress roll' : 'an action roll'} for ${move.displayName}`"
      />
      <btn-oracle class="move-oracle" v-if="oracles.length > 0" />
      <btn-sendmovetochat :move="move" :tooltip="`Send the text of ${move.displayName} as a chat message`" />
    </div>
    <move-rulestext element="main" slot="default" :actor="actor" :move="move" />
    <footer slot="footer">
      <cite>{{ sourceTitle }}</cite
      >{{ dateString }}, {{ pageString }}
    </footer>
  </expandable-article>
</template>

<style lang="less">
.move-leaf-content {
  @iconButtonWidth: 1.5rem;
  gap: 0.5rem;
  & > *:not(header) {
    padding: 0;
    padding-right: @iconButtonWidth / 4;
    padding-left: @iconButtonWidth;
    &:last-child {
      padding-bottom: @iconButtonWidth / 4;
    }
  }

  footer {
    padding-top: @iconButtonWidth / 4;
    line-height: 1;
    font-size: small;
    text-align: end;
  }

  header {
    display: grid;
    grid-auto-flow: column;
    // grid-auto-columns: @iconButtonWidth;
    grid-template-columns: @iconButtonWidth 1fr @iconButtonWidth @iconButtonWidth;
    .move-roll {
      grid-column: 1;
    }
    .expand-toggle {
      grid-column: 2;
      // justify-content: space-between;
      gap: 0.25rem;
      white-space: nowrap;
      padding: 0;

      font-size: var(--font-size-12);
      .subtitle {
        font-family: var(--font-compact);
        font-weight: 400;
        font-size: small;
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        flex-grow: 0;
        font-style: italic;
        color: currentColor;
        opacity: 50%;
      }
    }
    .move-chat {
      grid-column: 4;
    }
    .move-oracle {
      grid-column: 3;
    }
    .move-buttons {
      display: contents;
      .icon-button {
        height: @iconButtonWidth;
        width: @iconButtonWidth;
      }
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
  watch: {
    'move.highlighted': async function (value) {
      if (value) {
        this.expanded = true
        await new Promise((r) => setTimeout(r, 200))
        this.$el.scrollIntoView()
      }
    },
  },
  computed: {
    isProgressMove() {
      return this.move.moveItem?.data?.data?.['Progress Move']
    },
    toggleTooltip() {
      const action = this.expanded ? 'hide' : 'show'
      return `Click to ${action} the text of ${this.move.displayName}`
    },
    oracles() {
      return this.move.moveItem?.data?.data?.Oracles ?? []
    },

    triggerOptions() {
      return this.move.moveItem?.data?.data?.Trigger?.Options ?? []
    },
    fulltext() {
      return this.move.moveItem?.data?.data?.Text
    },
    sourceTitle() {
      return this.move.dataforgedMove?.Source?.Title ?? ''
    },
    pageString() {
      if (this.move.dataforgedMove?.Source?.Page) {
        return `p. ${this.move.dataforgedMove?.Source?.Page}`
      }
      return ''
    },
    dateString() {
      if (this.move.dataforgedMove?.Source?.Date) {
        return ` (${this.move.dataforgedMove?.Source?.Date})`
      }
      return ''
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
}
</script>
