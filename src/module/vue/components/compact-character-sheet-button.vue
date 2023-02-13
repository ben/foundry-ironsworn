<template>
  <div class="box flexcol" style="height: 100%">
    <h4>{{ $capitalize($t(`IRONSWORN.${$capitalize(propKey)}`)) }}</h4>
    <h4>{{ actorSystem?.[propKey] }}</h4>
    <div class="flexrow" style="flex: 1; justify-content: center">
      <IronBtn icon="fa:subtract" />
      <IronBtn v-if="burnButton" icon="fa:flame" />
      <IronBtn icon="fa:plus" />
    </div>
  </div>
</template>

<style lang="less" module></style>

<script setup lang="ts">
import { inject } from 'vue'
import { CharacterDataProperties } from '../../actor/actortypes'
import { ActorKey } from '../provisions'
import IronBtn from './buttons/iron-btn.vue'

const {
  propKey,
  rollable = true,
  burnButton = false,
} = defineProps<{
  propKey: string
  rollable?: boolean
  burnButton?: boolean
}>()

const actor = inject(ActorKey)
const actorSystem = (actor?.value as any)?.system as CharacterDataProperties
</script>
