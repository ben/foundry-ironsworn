<template>
  <section :class="classes" @click="click">
    <span class="attr-name">{{ $t(i18nLabelKey) }}</span>
    <section class="attr-spinner">
      <button v-if="editMode" type="button" class="clickable text" @click="decrement">&minus;</button>
      <!-- TODO: refactor as a spinner component -->
      <span class="attr-value">{{ actor.data[attr] }}</span>
      <button v-if="editMode" type="button" class="clickable text" @click="increment">&plus;</button>
    </section>
  </section>
</template>
<style lang="less">
@import '../../../styles/mixins.less';
@import '../../../styles/fonts.less';
.attr-box {
  .flexcol();
  @fillColor: black;
  border: 1px solid;
  border-radius: 5px;
  text-align: center;
  padding: 0.5rem 0;
  line-height: 1;
  gap: 0.25rem;
  .text-display();
  //
  &.bg-die {
    // TODO: refactor as background mask mixin
    // isicon-d10-tilt
    .stencil(fade(@fillColor,0), 'system/assets/d10-tilt-mask.svg',-2);
    &:hover {
      transition: background-color 0.4s ease;
      opacity: 0.2;
      .stencil(fade(@fillColor,0.2), 'system/assets/d10-tilt-mask.svg',-2);
    }
  }
  .attr-name {
    font-size: var(--font-size-12);
  }
  .attr-spinner {
    justify-content: center;
    .attr-value {
      .text-display();
      font-size: var(--font-size-20);
    }
    button {
      .simpleButton();
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
