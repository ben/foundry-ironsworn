<template>
  <div class="flexcol">
    <transition-group name="slide" tag="div" class="nogrow">
      <div
        class="item-row nogrow"
        v-for="(bond, i) in item.data.bonds"
        :key="i"
      >
        <div class="flexrow" style="margin-bottom: 5px">
          <input type="text" v-model="bond.name" @blur="save" />
          <icon-button icon="trash" @click="deleteBond(i)" />
        </div>
        <textarea v-model="bond.notes" @blur="save" />
      </div>
    </transition-group>

    <icon-button icon="plus" @click="addBond" style="text-align: center" />
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
  overflow: hidden;
  max-height: 93px;
  opacity: 1;
}
.slide-enter,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
  border-top: 0;
  border-bottom: 0;
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
