<template>
  <div class="flexcol">
    <transition-group name="slide" tag="div" class="nogrow">
      <div class="item-row nogrow" v-for="(bond, i) in item.data.bonds" :key="'bond' + i">
        <div class="flexrow" style="margin-bottom: 5px">
          <input type="text" v-model="bond.name" @blur="save" />
          <btn-isicon icon="trash" @click="deleteBond(i)" />
        </div>
        <textarea v-model="bond.notes" @blur="save" />
      </div>
    </transition-group>

    <btn-isicon icon="plus" @click="addBond" style="text-align: center" />
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  max-height: 93px;
}
</style>

<script>
export default {
  props: {
    item: Object,
  },

  methods: {
    deleteBond(i) {
      const bonds = Object.values(this.item.data.bonds)
      bonds.splice(i, 1)
      this.$item.update({ data: { bonds } })
    },

    addBond() {
      const bonds = Object.values(this.item.data.bonds)
      bonds.push({ name: '', notes: '' })
      this.$item.update({ data: { bonds } })
    },

    save() {
      const bonds = Object.values(this.item.data.bonds)
      this.$item.update({ data: { bonds } })
    },
  },
}
</script>
