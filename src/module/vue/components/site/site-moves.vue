<template>
  <div class="boxgroup moves nogrow" style="margin-bottom: 1em">
    <div class="flexrow boxrow" style="justify-items: stretch">
      <BtnRollmove :move="moves.delveTheDepths" class="box juicy text block">
        {{ moves.delveTheDepths?.displayName }}
      </BtnRollmove>

      <BtnIsicon
        icon="d10-tilt"
        class="box juicy text block"
        :class="{ disabled: !hasThemeAndDomain }"
        @click="randomFeature"
      >
        {{ $t('IRONSWORN.Feature') }}
      </BtnIsicon>

      <BtnRollmove
        :move="moves.revealADanger"
        class="box juicy text block"
        :disabled="!hasThemeAndDomain"
      >
        {{ moves.revealADanger?.displayName }}
      </BtnRollmove>
    </div>
    <div class="flexrow boxrow">
      <!-- This one is really just an oracle roll with some description -->
      <BtnRollmove :move="moves.findAnOpportunity" class="box juicy text block">
        {{ moves.findAnOpportunity?.displayName }}
      </BtnRollmove>

      <BtnIsicon
        icon="d10-tilt"
        class="box juicy text block"
        @click="locateObjective"
      >
        {{ $t('IRONSWORN.MoveContents.Locate Your Objective.title') }}
      </BtnIsicon>

      <BtnRollmove :move="moves.escapeTheDepths" class="box juicy text block">
        {{ moves.escapeTheDepths?.displayName }}
      </BtnRollmove>
    </div>
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

import BtnRollmove from '../buttons/btn-rollmove.vue'
import BtnIsicon from '../buttons/btn-isicon.vue'

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
