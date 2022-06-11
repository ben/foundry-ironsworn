<template>
  <component class="attr-box block text icon-bg-hover" :is="element" :actor="actor" :attr="attr">
    <span class="attr-name">{{ $t(i18nLabelKey) }}</span>
    <section class="attr-spinner">
      <button v-if="editMode" type="button" class="clickable text" @click="decrement">&minus;</button>
      <span class="attr-value">{{ actor.data[attr] }}</span>
      <button v-if="editMode" type="button" class="clickable text" @click="increment">&plus;</button>
    </section>
  </component>
</template>
<style lang="less">
@import '../../../../styles/fonts.less';

button.attr-box,
div.attr-box {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  @fillColor: black;
  border: 1px solid;
  border-radius: 5px;
  text-align: center;
  padding: 0.5rem 0;
  line-height: 1;
  gap: 0.25rem;
  .text-display();
  //
  .attr-name {
    font-size: var(--font-size-12);
  }
  .attr-spinner {
    justify-content: space-evenly;
    display: flex;
    flex-flow: row nowrap;
    .attr-value {
      .text-display();
      font-size: var(--font-size-20);
    }
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    attr: String,
  },

  computed: {
    element() {
      if (this.editMode) {
        return 'div'
      } else {
        return 'btn-actionroll'
      }
    },
    classes() {
      return {
        'attr-box': true,
        block: true,
        'bg-die': !this.editMode,
        clickable: this.clickable,
      }
    },
    i18nLabelKey() {
      return `IRONSWORN.${this.$capitalize(this.attr)}`
    },
    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },
    clickable() {
      return this.editMode ? '' : ' clickable '
    },
  },

  methods: {
    click() {
      if (this.editMode) return
      const actor = game.actors?.get(this.actor._id)
      CONFIG.IRONSWORN.RollDialog.show({ actor, stat: this.attr })
    },

    increment() {
      const value = parseInt(this.actor.data[this.attr]) + 1
      const actor = game.actors?.get(this.actor._id)
      actor?.update({ data: { [this.attr]: value } })
    },
    decrement() {
      const value = parseInt(this.actor.data[this.attr]) - 1
      const actor = game.actors?.get(this.actor._id)
      actor?.update({ data: { [this.attr]: value } })
    },
  },
}
</script>
