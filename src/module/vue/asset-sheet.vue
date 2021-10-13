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

  watch: {
    'item.name': CONFIG.IRONSWORN._.debounce(function () {
      this.$item().update({ name: this.item.name })
    }, 1000),
    'item.data.description': CONFIG.IRONSWORN._.debounce(function () {
      this.$item().update({ data: { description: this.item.data.description } })
    }, 1000),
  },

  methods: {},
}
</script>
