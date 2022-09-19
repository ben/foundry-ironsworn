<template>
  <SheetHeader style="gap: 5px">
    <document-img :document="actor" />
    <document-name :document="actor" />
    <div class="flexrow xp" style="gap: 5px">
      <h4 class="nogrow" style="margin: 0">{{ $t('IRONSWORN.XP') }}</h4>
      <div class="flexrow">
        <ClassicXpBox :key="0" :current="-1" :value="0" @click="setXp(0)">
          ×
        </ClassicXpBox>
        <ClassicXpBox
          v-for="n in xpArray"
          :key="n"
          :value="n"
          :current="actor.data.xp"
          @click="setXp(n)"
        />
      </div>
    </div>
  </SheetHeader>
</template>

<script setup lang="ts">
import SheetHeader from '../sheet-header.vue'
import { Ref, inject } from 'vue'
import { $ActorKey } from '../provisions'
import DocumentImg from './document-img.vue'
import DocumentName from './document-name.vue'
import ClassicXpBox from './classic-xp-box.vue'

const actor = inject('actor') as Ref
const xpArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const $actor = inject($ActorKey)
function setXp(n) {
  $actor?.update({ data: { xp: n } })
}
</script>
