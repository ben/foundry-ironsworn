<template>
  <div class="flexcol">
    <header class="sheet-header nogrow">
      <h1 class="charname">
        <input type="text" v-model="item.name" />
      </h1>
    </header>

    <p class="nogrow">
      <input v-if="editMode" type="text" v-model="item.data.description" />
      <span v-else>{{ item.data.description }}</span>
    </p>

    <h4 class="nogrow">{{ $t('IRONSWORN.Fields') }}</h4>
    <div class="boxgroup nogrow">
      <div
        class="flexrow boxrow nogrow fieldrow"
        v-for="(field, i) in item.data.fields"
        :key="i"
      >
        <div class="box flexrow" style="align-items: center">
          <input v-if="editMode" type="text" v-model="field.name" />
          <p v-else>{{ field.name }}</p>
        </div>
        <div class="box flexrow">
          <input type="text" v-model="field.value" />
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
  </div>
</template>

<style lang="less" scoped>
.fieldrow {
  p,
  input {
    text-align: left;
    padding: 0 0.5em;
    margin: 3px;
  }
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

  watch: {
    'item.name': CONFIG.IRONSWORN._.debounce(function () {
      this.$item().update({ name: this.item.name })
    }, 1000),

    'item.data.description': CONFIG.IRONSWORN._.debounce(function () {
      this.$item().update({ data: { description: this.item.data.description } })
    }, 1000),

    'item.data.fields': {
      deep: true,
      handler: CONFIG.IRONSWORN._.debounce(function () {
        this.$item().update({ data: { fields: this.item.data.fields } })
      }, 1000),
    },
  },

  methods: {
    addField() {
      const fields = Object.values(this.item.data.fields)
      fields.push({ name: ' ', value: ' ' })
      this.$item().update({ data: { fields } })
    },

    deleteField(idx) {
      const fields = Object.values(this.item.data.fields)
      fields.splice(idx, 1)
      this.$item().update({ data: { fields } })
    },
  },
}
</script>
