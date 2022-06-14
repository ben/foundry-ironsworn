<template>
  <!-- TODO: refactor as a list, because that's what this is. -->
  <!--
    in fact, every similarly shaped "list of things what gets added to" should probably descend from a single component
  -->
  <article class="flexcol bondset-sheet">
    <transition-group name="slide" tag="div" class="nogrow">
      <div class="item-row nogrow" v-for="(bond, i) in item.data.bonds" :key="'bond' + i">
        <section class="flexrow inputs">
          <input type="text" v-model="bond.name" @blur="save" />
          <btn-faicon icon="trash" @click="deleteBond(i)" />
        </section>
        <textarea v-model="bond.notes" @blur="save" />
      </div>
    </transition-group>

    <btn-faicon icon="plus" @click="addBond" />
  </article>
</template>

<style lang="less">
.bondset-sheet {
  .slide-enter-active,
  .slide-leave-active {
    max-height: 93px;
  }
  .item-row {
    .inputs {
      margin-bottom: 5px;
    }
  }
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
