<template>
  <div class="flexcol" v-bind:style="`background-color: ${thematicColor}`">
    <SfMoverow
      :move="moves.delveTheDepths"
      v-if="moves.delveTheDepths"
      :thematic-color="thematicColor"
      class="nogrow"
    />
    <SfMoverow
      :move="moves.findAnOpportunity"
      v-if="moves.findAnOpportunity"
      :thematic-color="thematicColor"
      class="nogrow"
    />
    <SfMoverow
      :move="moves.revealADanger"
      v-if="moves.revealADanger"
      :thematic-color="thematicColor"
      class="nogrow"
      @oracleClick="revealADanger"
      :oracle-disabled="!hasThemeAndDomain"
    />
    <SfMoverow
      :move="moves.locateObjective"
      v-if="moves.locateObjective"
      :thematic-color="thematicColor"
      class="nogrow"
      @rollClick="locateObjective"
    />
    <SfMoverow
      :move="moves.escapeTheDepths"
      v-if="moves.escapeTheDepths"
      :thematic-color="thematicColor"
      class="nogrow"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, reactive } from 'vue'
import { SiteDataPropertiesData } from '../../../actor/actortypes'
import { createIronswornChatRoll } from '../../../chat/chatrollhelpers'
import { getFoundryTableByDfId } from '../../../dataforged'
import { createIronswornMoveTree, Move } from '../../../features/custommoves'
import { moveDataByName } from '../../../helpers/data'
import { DelveThemeDataSourceData } from '../../../item/itemtypes'
import {
  TableRow,
  OracleRollMessage,
  IronswornPrerollDialog,
} from '../../../rolls'
import { $ActorKey, ActorKey } from '../../provisions'

import BtnIsicon from '../buttons/btn-isicon.vue'
import SfMoverow from '../sf-moverow.vue'
import SiteMoverowFeature from './site-moverow-feature.vue'

const site = inject(ActorKey)
const $site = inject($ActorKey)

const theme = computed(() => {
  return site?.value?.items.find((x) => x.type === 'delve-theme')
})
const domain = computed(() => {
  return site?.value?.items.find((x) => x.type === 'delve-domain')
})

const thematicColor = 'var(--ironsworn-color-shade-2)'

const hasThemeAndDomain = computed(() => {
  return !!(theme.value && domain.value)
})

// Construct some moves to use with the new pipeline
const moves = reactive<{ [k: string]: Move }>({})
Promise.resolve().then(async () => {
  const moveTree = await createIronswornMoveTree()
  const delveMoves = moveTree.find(
    (x) => x.dataforgedCategory?.$id === 'Ironsworn/Moves/Delve'
  )
  if (!delveMoves) return

  const movesToFetch = {
    delveTheDepths: 'Ironsworn/Moves/Delve/Delve_the_Depths',
    revealADanger: 'Ironsworn/Moves/Delve/Reveal_a_Danger',
    findAnOpportunity: 'Ironsworn/Moves/Delve/Find_an_Opportunity',
    escapeTheDepths: 'Ironsworn/Moves/Delve/Escape_the_Depths',
    locateObjective: 'Ironsworn/Moves/Delve/Locate_Your_Objective',
  }

  for (const k of Object.keys(movesToFetch)) {
    moves[k] = delveMoves.moves.find(
      (x) => x.dataforgedMove?.$id === movesToFetch[k]
    )!
  }
})

async function revealADanger() {
  if (!hasThemeAndDomain.value) return

  const oracle = await getFoundryTableByDfId(
    'Ironsworn/Oracles/Moves/Reveal_a_Danger'
  )
  if (!oracle) return
  const oracleRows = oracle.results.map((x: any) => ({
    low: x.range[0],
    high: x.range[1],
    text: x.text,
    selected: false,
  }))
  // Remove the first two rows
  oracleRows.shift()
  oracleRows.shift()

  const themeData = (theme.value as any)?.system as DelveThemeDataSourceData
  const domainData = (domain.value as any)?.system as DelveThemeDataSourceData
  const tdRows = [...themeData.dangers, ...domainData.dangers].map(
    ({ low, high, description }) => ({
      low,
      high,
      text: description,
      selected: false,
    })
  )
  const rows = [...tdRows, ...oracleRows]

  const title = moves.revealADanger.moveItem().name ?? 'Reveal a Danger'
  const subtitle = `${$site?.name} – ${theme.value?.name} ${domain.value?.name}`
  const orm = await OracleRollMessage.fromRows(rows, title, subtitle)
  orm.createOrUpdate()
}

async function locateObjective() {
  if (!$site) return
  const move = await moveDataByName('Locate Your Objective')
  const siteSys = $site.system as SiteDataPropertiesData
  const progress = Math.floor(siteSys.current / 4)

  IronswornPrerollDialog.showForOfficialMove(
    'Ironsworn/Moves/Delve/Locate_Your_Objective',
    {
      actor: $site,
      progress: {
        source: $site.name ?? '',
        value: progress,
      },
    }
  )
}
</script>
