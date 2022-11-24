<template>
  <div class="flexcol">
    <SfMoverow
      :move="moves.delveTheDepths"
      v-if="moves.delveTheDepths"
      thematic-color="#333"
      class="nogrow"
    />
    <SfMoverow
      :move="moves.revealADanger"
      v-if="moves.revealADanger"
      thematic-color="#333"
      class="nogrow"
    />
    <SfMoverow
      :move="moves.findAnOpportunity"
      v-if="moves.findAnOpportunity"
      thematic-color="#333"
      class="nogrow"
    />
    <SfMoverow
      :move="moves.escapeTheDepths"
      v-if="moves.escapeTheDepths"
      thematic-color="#333"
      class="nogrow"
    />
    <BtnIsicon
      icon="d10-tilt"
      class="box text block nogrow"
      :class="{ disabled: !hasThemeAndDomain }"
      @click="randomFeature"
    >
      {{ $t('IRONSWORN.Feature') }}
    </BtnIsicon>
    <BtnIsicon
      icon="d10-tilt"
      class="box text block nogrow"
      @click="locateObjective"
    >
      {{ $t('IRONSWORN.MoveContents.Locate Your Objective.title') }}
    </BtnIsicon>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, reactive } from 'vue'
import { SiteDataPropertiesData } from '../../../actor/actortypes'
import { createIronswornChatRoll } from '../../../chat/chatrollhelpers'
import { createIronswornMoveTree, Move } from '../../../features/custommoves'
import { moveDataByName } from '../../../helpers/data'
import {
  DelveThemeDataSourceData,
  FeatureOrDanger,
} from '../../../item/itemtypes'
import { TableRow, OracleRollMessage } from '../../../rolls'
import { $ActorKey, ActorKey } from '../../provisions'

import BtnIsicon from '../buttons/btn-isicon.vue'
import SfMoverow from '../sf-moverow.vue'

const site = inject(ActorKey)
const $site = inject($ActorKey)

const theme = computed(() => {
  return site?.value?.items.find((x) => x.type === 'delve-theme')
})
const domain = computed(() => {
  return site?.value?.items.find((x) => x.type === 'delve-domain')
})

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
  }

  for (const k of Object.keys(movesToFetch)) {
    moves[k] = delveMoves.moves.find(
      (x) => x.dataforgedMove?.$id === movesToFetch[k]
    )!
  }
})

async function randomFeature() {
  if (!hasThemeAndDomain.value) return

  const themeData = (theme.value as any)?.system as DelveThemeDataSourceData
  const domainData = (domain.value as any)?.system as DelveThemeDataSourceData
  const convertToRow = (f: FeatureOrDanger): TableRow => {
    const { low, high, description } = f
    return {
      low,
      high,
      text: description,
      selected: false,
    }
  }
  const rows = [
    ...themeData.features.map(convertToRow),
    ...domainData.features.map(convertToRow),
  ]
  const title = game.i18n.localize('IRONSWORN.Feature')
  const subtitle = `${$site?.name} – ${theme.value?.name} ${domain.value?.name}`
  const orm = await OracleRollMessage.fromRows(rows, title, subtitle)
  orm.createOrUpdate()
}

async function locateObjective() {
  if (!$site) return
  const move = await moveDataByName('Locate Your Objective')
  const siteSys = $site.system as SiteDataPropertiesData
  const progress = Math.floor(siteSys.current / 4)
  const roll = new Roll(`{${progress}, d10, d10}`)
  createIronswornChatRoll({
    isProgress: true,
    move,
    roll,
    subtitle: $site.name || undefined,
  })
}
</script>
