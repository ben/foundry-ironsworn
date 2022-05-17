<template>
  <div :class="classes" @click="click">
    <h4>{{ $t(i18nKey) }}</h4>
    <div class="flexrow" style="position: relative">
      <div v-if="!editMode" class="bg-die">
        <i class="isicon-d10-tilt"></i>
      </div>
      <div class="clickable text" v-if="editMode" @click="decrement">
        &minus;
      </div>
      <h4>{{ actor.data[attr] }}</h4>
      <div class="clickable text" v-if="editMode" @click="increment">
        &plus;
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bg-die {
  position: absolute;
  left: 19px;
  top: -17px;
  opacity: 0;
  font-size: 35px;
}

.stat:hover .bg-die {
  transition: opacity 0.4s ease;
  opacity: 0.2;
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
        stat: true,
        block: true,
        clickable: this.clickable,
      }
    },
    i18nKey() {
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
