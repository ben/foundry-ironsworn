<template>
  <header class="sheet-header" style="gap: 5px">
    <document-img :document="actor" />
    <document-name :document="actor" />
    <div class="flexrow xp" style="gap: 5px">
      <h4 class="nogrow" style="margin: 0">{{ $t('IRONSWORN.XP') }}</h4>
      <div class="flexrow">
        <xp-box :value="0" @click="setXp(0)">×</xp-box>
        <xp-box
          v-for="n in xpArray"
          v-bind:key="n"
          :value="n"
          :current="actor.data.xp"
          @click="setXp(n)"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { reactive } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
import { $ActorKey } from '../provisions'
import XpBox from './xp-box.vue'
import DocumentImg from './document-img.vue'
import DocumentName from './document-name.vue'

const actor = inject('actor') as Ref
const xpArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const $actor = inject($ActorKey)
function setXp(n) {
  $actor?.update({ data: { xp: n } })
}
</script>
