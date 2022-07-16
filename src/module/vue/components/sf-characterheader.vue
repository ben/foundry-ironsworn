<template>
  <header class="sheet-header flexrow">
    <document-img :document="actor" size="75px" />

    <div class="flexcol" style="flex-basis: 100px; margin-left: 6px">
      <input
        type="text"
        style="margin-bottom: 7px"
        :placeholder="$t('IRONSWORN.Name')"
        v-model="actor.name"
        ref="name"
        @keyup="save"
      />
      <input
        type="text"
        style="margin-bottom: 7px"
        :placeholder="$t('IRONSWORN.Pronouns')"
        :value="actor.data.pronouns"
        ref="pronouns"
        @keyup="save"
      />
      <input
        type="text"
        :placeholder="$t('IRONSWORN.Callsign')"
        :value="actor.data.callsign"
        ref="callsign"
        @keyup="save"
      />
    </div>

    <textarea
      rows="4"
      :value="actor.data.biography"
      ref="characteristics"
      style="flex-basis: 300px; margin-left: 6px"
      :placeholder="$t('IRONSWORN.Characteristics')"
      @keyup="save"
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
import { debounce } from 'lodash'
import { inject, ref, Ref } from 'vue'
import { IronswornActor } from '../../actor/actor'
import documentImg from './document-img.vue'

const actor = inject('actor') as any
const $actor = inject('$actor') as IronswornActor

const name = ref<HTMLInputElement | null>(null)
const callsign = ref<HTMLInputElement | null>(null)
const pronouns = ref<HTMLInputElement | null>(null)
const characteristics = ref<HTMLInputElement | null>(null)

const save = debounce(() => {
  console.log('saving')
  $actor?.update({
    name: name.value?.value,
    data: {
      callsign: callsign.value?.value,
      pronouns: pronouns.value?.value,
      biography: characteristics.value?.value,
    },
  })
}, 500)
</script>
