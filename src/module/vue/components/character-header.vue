<template>
  <SheetHeaderBasic class="nogrow" :document="actor">
    <section class="flexrow xp" style="gap: 5px">
      <h4 class="nogrow" style="margin: 0">{{ $t('IRONSWORN.XP') }}</h4>
      <div class="flexrow">
        <xp-box :key="0" :current="-1" :value="0" @click="setXp(0)"> × </xp-box>
        <xp-box
          v-for="n in xpArray"
          :key="n"
          :value="n"
          :current="actor.data.xp"
          @click="setXp(n)"
        />
      </div>
    </section>
  </SheetHeaderBasic>
</template>

<script setup lang="ts">
import SheetHeaderBasic from '../sheet-header-basic.vue'
import { Ref, inject } from 'vue'
import { $ActorKey } from '../provisions'
import XpBox from './xp-box.vue'
const actor = inject('actor') as Ref
const xpArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const $actor = inject($ActorKey)
function setXp(n) {
  $actor?.update({ data: { xp: n } })
}
</script>
