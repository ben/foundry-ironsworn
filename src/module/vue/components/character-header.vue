<template>
  <SheetHeaderBasic class="nogrow" :document="actor">
    <section class="flexrow xp-track-classic" style="gap: 5px">
      <h4 class="nogrow" style="margin: 0">{{ $t('IRONSWORN.XP') }}</h4>
      <div class="flexrow">
        <XpBox :key="0" :current="-1" :value="0" @click="setXp(0)"> × </XpBox>
        <XpBox
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
<style lang="less">
.xp-track-classic {
  flex-grow: 0;
  flex-direction: row;
  flex-basis: 130px;
  align-items: center;
  .xp-box {
    border: 1px solid currentColor;
    aspect-ratio: 1;
    height: 15px;
    flex-basis: 15px;
    margin: 3px;
    text-align: center;
    padding: 2px;
    box-sizing: border-box;
    background-clip: content-box;
    align-items: center;
    display: flex;
    justify-content: center;
    &.selected {
      background-color: currentColor;
    }
  }
}
</style>
<script setup lang="ts">
import SheetHeaderBasic from '../sheet-header-basic.vue'
import { Ref, inject } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import XpBox from './xp-box.vue'

const actor = inject(ActorKey) as Ref
const xpArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const $actor = inject($ActorKey)
function setXp(n) {
  $actor?.update({ data: { xp: n } })
}
</script>
