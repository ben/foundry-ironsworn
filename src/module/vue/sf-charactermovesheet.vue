<template>
  <Tabs ref="tabs">
    <tab icon="isicon-d10-tilt" :title="$t('IRONSWORN.Moves')">
      <Suspense>
        <sf-movesheetmoves ref="movesTab" :toolset="toolset" />
      </Suspense>
    </tab>
    <tab icon="isicon-oracle" :title="$t('IRONSWORN.Oracles')">
      <Suspense>
        <sf-movesheetoracles ref="oraclesTab" :toolset="toolset" />
      </Suspense>
    </tab>
  </Tabs>
</template>

<script lang="ts" setup>
import Tab from './components/tabs/tab.vue'
import Tabs from './components/tabs/tabs.vue'
import SfMovesheetmoves from './components/sf-movesheetmoves.vue'
import SfMovesheetoracles from './components/sf-movesheetoracles.vue'
import { computed, provide, ref } from 'vue'
import { CharacterDataProperties } from '../actor/actortypes'
import { ActorKey } from './provisions.js'

const props = defineProps<{
  actor: CharacterDataProperties
  toolset: 'ironsworn' | 'starforged'
}>()

provide(ActorKey, computed(() => props.actor) as any)

const tabs = ref<InstanceType<typeof Tabs>>()
const movesTab = ref<InstanceType<typeof SfMovesheetmoves>>()
CONFIG.IRONSWORN.emitter.on('highlightMove', () => tabs.value?.selectIndex(0))

const oraclesTab = ref<InstanceType<typeof SfMovesheetoracles>>()
CONFIG.IRONSWORN.emitter.on('highlightOracle', () => tabs.value?.selectIndex(1))
</script>
