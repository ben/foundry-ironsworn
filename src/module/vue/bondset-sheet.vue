<template>
  <div class="flexcol">
    <div class="item-row nogrow" v-for="(bond, i) in item.data.bonds" :key="i">
      <div class="flexrow" style="margin-bottom: 5px">
        <input type="text" v-model="bond.name" @blur="save" />
        <icon-button icon="trash" @click="deleteBond(i)" />
      </div>
      <textarea v-model="bond.notes" @blur="save" />
    </div>

    <icon-button icon="plus" @click="addBond" style="text-align: center" />
  </div>
</template>

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
