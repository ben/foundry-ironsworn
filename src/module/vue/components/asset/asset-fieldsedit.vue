<template>
  <div class="boxgroup">
    <div
      class="flexrow boxrow nogrow fieldrow"
      v-for="(field, i) in item.data.fields"
      :key="i"
    >
      <div class="box flexrow" style="align-items: center">
        <input v-if="editMode" type="text" v-model="field.name" @blur="save" />
        <p v-else>{{ field.name }}</p>
      </div>
      <div class="box flexrow">
        <input type="text" v-model="field.value" @blur="save" />
      </div>
      <div v-if="editMode" class="box flexrow nogrow">
        <icon-button icon="trash" @click="deleteField(i)" />
      </div>
    </div>
    <div class="flexrow boxrow nogrow">
      <div
        class="box clickable block"
        @click="addField"
        style="min-height: 1.5rem; align-items: center"
      >
        <i class="fas fa-plus" />
      </div>
    </div>
  </div>
</template>

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
    }
  },
}
</script>
