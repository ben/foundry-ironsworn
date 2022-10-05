<template>
  <SheetHeader class="sf-character-header">
    <DocumentImg :document="actor" size="75px" />
    <section class="header-pc-vitals flexcol">
      <input
        type="text"
        :placeholder="$t('IRONSWORN.Name')"
        v-model="actor.name"
        ref="name"
        @keyup="save"
      />
      <input
        type="text"
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
    </section>

    <textarea
      :value="actor.data.biography"
      ref="characteristics"
      :placeholder="$t('IRONSWORN.Characteristics')"
      @keyup="save"
    />
  </SheetHeader>
</template>

<style lang="less" scoped>
input,
textarea {
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  font-family: var(--font-primary);
  resize: none;
  font-size: inherit;
}
textarea {
  flex-basis: 300px;
  margin: 0;
  flex-grow: 2;
}
.header-pc-vitals {
  flex-basis: 100px;
  min-width: 20ch;
  max-width: 30ch;
  gap: 5px;
  flex-grow: 1;
}
</style>

<script lang="ts" setup>
import SheetHeader from '../sheet-header.vue'
import { debounce } from 'lodash'
import { inject, ref, Ref } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import DocumentImg from './document-img.vue'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const name = ref<HTMLInputElement | null>(null)
const callsign = ref<HTMLInputElement | null>(null)
const pronouns = ref<HTMLInputElement | null>(null)
const characteristics = ref<HTMLInputElement | null>(null)

const save = debounce(() => {
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
