<template>
  <div class="box flexcol" style="height: 100%">
    <h4>{{ $capitalize($t(`IRONSWORN.${$capitalize(propKey)}`)) }}</h4>
    <h4>{{ value }}</h4>
    <div class="flexrow" style="flex: 1; justify-content: center">
      <IronBtn icon="fa:subtract" @click="increment(-1)" />
      <IronBtn
        v-if="burnButton"
        icon="fa:flame"
        @click="$actor?.burnMomentum()"
      />
      <IronBtn icon="fa:plus" @click="increment(1)" />
    </div>
  </div>
</template>

<style lang="less" module></style>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { CharacterDataProperties } from '../../actor/actortypes'
import { $ActorKey, ActorKey } from '../provisions'
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
const actorSystem = computed(
  () => (actor?.value as any)?.system as CharacterDataProperties
)
const value = computed(() => actorSystem?.value?.[propKey])
const $actor = inject($ActorKey)

function increment(delta: number) {
  $actor?.update({ system: { [propKey]: value.value + delta } })
}
</script>
