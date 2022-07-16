<template>
  <header class="sheet-header flexrow">
    <document-img :document="actor" size="75px" />

    <div class="flexcol" style="flex-basis: 100px">
      <input
        type="text"
        style="margin-bottom: 7px"
        :placeholder="$t('IRONSWORN.Name')"
        v-model="actor.data.name"
        ref="name"
        @blur="save"
      />
      <input
        type="text"
        style="margin-bottom: 7px"
        :placeholder="$t('IRONSWORN.Pronouns')"
        :value="actor.data.pronouns"
        ref="pronouns"
        @blur="save"
      />
      <input
        type="text"
        :placeholder="$t('IRONSWORN.Callsign')"
        :value="actor.data.callsign"
        ref="callsign"
        @blur="save"
      />
    </div>

    <textarea
      rows="4"
      :value="actor.data.biography"
      ref="characteristics"
      style="flex-basis: 300px; margin-left: 6px"
      :placeholder="$t('IRONSWORN.Characteristics')"
      @blur="save"
    />
  </header>
</template>

<style lang="less" scoped>
input,
textarea {
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  font-family: var(--font-primary);
  resize: none;
}
</style>

<script lang="ts" setup>
import { defineComponent, inject } from 'vue'
import { IronswornActor } from '../../actor/actor'
import { CharacterDataProperties } from '../../actor/actortypes'
import documentImg from './document-img.vue'

const actor = inject('actor') as CharacterDataProperties
const $actor = inject('$actor') as IronswornActor

function save() {
  this.$actor?.update({
    name: this.$refs.name.value,
    data: {
      callsign: this.$refs.callsign.value,
      pronouns: this.$refs.pronouns.value,
      biography: this.$refs.characteristics.value,
    },
  })
}
</script>
