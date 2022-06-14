<template>
  <div class="flexcol stack">
    <div v-if="editMode">
      <transition-group name="slide" tag="div">
        <div class="stack-row flexrow" v-for="(option, i) in item.data.exclusiveOptions" :key="'item' + i">
          <input type="text" v-model="option.name" @blur="updateOptionName(i)" />
          <btn-faicon icon="trash" @click="deleteOption(i)" />
        </div>
      </transition-group>
      <div class="stack-row clickable block" @click="addOption" style="min-height: 1.5rem; align-items: center">
        <i class="fas fa-plus" />
      </div>
    </div>

    <div v-else>
      <asset-exclusiveoption
        v-for="(opt, i) in item.data.exclusiveOptions"
        :key="'option' + i"
        :opt="opt"
        @click="markOption(i)"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.stack-row {
  align-items: stretch;
  input {
    margin: 2px 5px;
  }
}
.slide-enter-active,
.slide-leave-active {
  max-height: 30px;
}
</style>

<script>
export default {
  props: {
    item: Object,
  },

  computed: {
    editMode() {
      return this.item.flags['foundry-ironsworn']?.['edit-mode']
    },
  },

  methods: {
    enterEditMode() {
      this.$item.setFlag('foundry-ironsworn', 'edit-mode', true)
    },

    markOption(idx) {
      const exclusiveOptions = Object.values(this.item.data.exclusiveOptions)

      for (let i = 0; i < exclusiveOptions.length; i++) {
        exclusiveOptions[i] = {
          ...exclusiveOptions[i],
          selected: i === idx,
        }
      }
      this.$item.update({ data: { exclusiveOptions } })
    },

    updateOptionName(idx) {
      const { exclusiveOptions } = this.item.data
      this.$item.update({ data: { exclusiveOptions } })
    },

    deleteOption(idx) {
      const exclusiveOptions = Object.values(this.item.data.exclusiveOptions)
      const needNewSelection = exclusiveOptions[idx].selected
      exclusiveOptions.splice(idx, 1)
      if (needNewSelection && exclusiveOptions[0]) {
        exclusiveOptions[0].selected = true
      }
      this.$item.update({ data: { exclusiveOptions } })
    },

    addOption() {
      this.enterEditMode()
      const exclusiveOptions = Object.values(this.item.data.exclusiveOptions)
      exclusiveOptions.push({
        name: ' ',
        value: ' ',
        selected: exclusiveOptions.every((x) => !x.selected),
      })
      this.$item.update({ data: { exclusiveOptions } })
    },
  },
}
</script>
