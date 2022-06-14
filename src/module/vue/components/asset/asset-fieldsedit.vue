<template>
  <div class="boxgroup">
    <transition-group name="slide" tag="div" class="nogrow">
      <div class="flexrow boxrow nogrow fieldrow" v-for="(field, i) in item.data.fields" :key="'field' + i">
        <div class="box flexrow" style="align-items: center">
          <input v-if="editMode" type="text" v-model="field.name" @blur="save" />
          <p v-else>{{ field.name }}</p>
        </div>
        <div class="box flexrow">
          <input type="text" v-model="field.value" @blur="save" />
        </div>
        <div v-if="editMode" class="box flexrow nogrow">
          <btn-faicon icon="trash" @click="deleteField(i)" />
        </div>
      </div>
    </transition-group>
    <div class="flexrow boxrow nogrow" v-if="editMode">
      <btn-faicon icon="plus" class="box block" @click="addField" style="min-height: 1.5rem; align-items: center" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.boxrow {
  align-items: stretch;
  input {
    margin: 2px 5px;
    text-align: left;
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
    addField() {
      this.enterEditMode()
      const fields = Object.values(this.item.data.fields)
      fields.push({ name: ' ', value: ' ' })
      this.$item.update({ data: { fields } })
    },
    deleteField(idx) {
      const fields = Object.values(this.item.data.fields)
      fields.splice(idx, 1)
      this.$item.update({ data: { fields } })
    },
    save() {
      const fields = Object.values(this.item.data.fields)
      this.$item.update({ data: { fields } })
    },
  },
}
</script>
