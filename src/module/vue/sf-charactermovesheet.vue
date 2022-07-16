<template>
  <tabs ref="tabs">
    <!-- <tab :title="$t('IRONSWORN.Moves')">
      <sf-movesheetmoves ref="moves" />
    </tab> -->
    <tab :title="$t('IRONSWORN.Oracles')">
      <Suspense>
        <sf-movesheetoracles ref="oracles" />
      </Suspense>
    </tab>
  </tabs>
</template>

<script lang="ts" setup>
import Tab from './components/tabs/tab.vue'
import Tabs from './components/tabs/tabs.vue'
import SfMovesheetmoves from './components/sf-movesheetmoves.vue'
import SfMovesheetoracles from './components/sf-movesheetoracles.vue'
import { computed, provide } from 'vue'
import { CharacterDataProperties } from '../actor/actortypes'

const props = defineProps<{
  actor: CharacterDataProperties
}>()

provide(
  'actor',
  computed(() => props.actor)
)

// TODO: these almost certainly don't work
async function highlightMove(item) {
  this.currentTab = this.tabs[0]
  await this.$nextTick()
  this.$refs.tabs.$refs.activeTab?.['highlightMove']?.(item)
}

async function highlightOracle(dfid) {
  this.currentTab = this.tabs[1]
  await this.$nextTick()
  this.$refs.tabs.$refs.activeTab?.['highlightOracle']?.(dfid)
}
</script>
