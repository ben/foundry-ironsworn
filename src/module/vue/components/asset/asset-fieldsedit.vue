<template>
  <div class="boxgroup">
    <transition-group name="slide" tag="div" class="nogrow">
      <div
        class="flexrow boxrow nogrow fieldrow"
        v-for="(field, i) in item.data.fields"
        :key="'field' + i"
      >
        <div class="box flexrow" style="align-items: center">
          <input
            v-if="editMode"
            type="text"
            v-model="field.name"
            @blur="save"
          />
          <p v-else>{{ field.name }}</p>
        </div>
        <div class="box flexrow">
          <input type="text" v-model="field.value" @blur="save" />
        </div>
        <div v-if="editMode" class="box flexrow nogrow">
          <icon-button icon="trash" @click="deleteField(i)" />
        </div>
      </div>
    </transition-group>
    <div class="flexrow boxrow nogrow" v-if="editMode">
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
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 30px;
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
