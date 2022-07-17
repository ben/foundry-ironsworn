<template>
  <tabs ref="tabs">
    <tab :title="$t('IRONSWORN.Moves')">
      <Suspense>
        <sf-movesheetmoves ref="movesTab" />
      </Suspense>
    </tab>
    <tab :title="$t('IRONSWORN.Oracles')">
      <Suspense>
        <sf-movesheetoracles ref="oraclesTab" />
      </Suspense>
    </tab>
  </tabs>
</template>

<script lang="ts" setup>
import Tab from './components/tabs/tab.vue'
import Tabs from './components/tabs/tabs.vue'
import SfMovesheetmoves from './components/sf-movesheetmoves.vue'
import SfMovesheetoracles from './components/sf-movesheetoracles.vue'
import { computed, nextTick, provide, ref } from 'vue'
import { CharacterDataProperties } from '../actor/actortypes'

const props = defineProps<{
  actor: CharacterDataProperties
}>()

provide(
  'actor',
  computed(() => props.actor)
)

// TODO: these almost certainly don't work
const tabs = ref<InstanceType<typeof Tabs>>()
const movesTab = ref<InstanceType<typeof SfMovesheetmoves>>()
async function highlightMove(item) {
  tabs.value?.selectIndex(0)
  await nextTick()
  movesTab.value?.highlightMove(item)
}

const oraclesTab = ref<InstanceType<typeof SfMovesheetoracles>>()
async function highlightOracle(dfid) {
  tabs.value?.selectIndex(1)
  await nextTick()
  oraclesTab.value?.highlightOracle(dfid)
}
</script>
