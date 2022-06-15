<template>
  <div>
    <div class="flexrow" style="align-items: center">
      <label class="flexrow" style="align-items: center">
        <input
          type="checkbox"
          class="nogrow"
          :checked="item.data.track.enabled"
          @change="enableClick"
        />
        <span>{{ $t('IRONSWORN.Enabled') }}</span>
      </label>

      <span style="flex-grow: 0; margin: 0 5px">{{
        $t('IRONSWORN.Name')
      }}</span>
      <input type="text" @blur="updateName" v-model="item.data.track.name" />

      <span style="flex-grow: 0; margin: 0 5px">{{ $t('IRONSWORN.Max') }}</span>
      <input
        type="number"
        @blur="updateMax"
        v-model.number="item.data.track.max"
      />
    </div>
    <asset-track style="margin-top: 5px" :actor="item.parent" :item="item" />
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
    enableClick(ev) {
      this.$item.update({ 'data.track.enabled': ev.target.checked })
    },

    updateName() {
      this.$item.update({ 'data.track.name': this.item.data.track.name })
    },

    updateMax() {
      this.$item.update({ 'data.track.max': this.item.data.track.max })
    },
  },
}
</script>
