<template>
  <div class="boxgroup moves nogrow" style="margin-bottom: 1em">
    <div class="flexrow boxrow">
      <SiteMovebox movename="Delve the Depths" />
      <!-- TODO: double check styling here -->
      <button
        type="button"
        class="box flexrow clickable block"
        :class="{ disabled: !hasThemeAndDomain }"
        @click="randomFeature"
      >
        <h4>
          {{ $t('IRONSWORN.Feature') }}
        </h4>
      </button>

      <SiteMovebox movename="Reveal a Danger" :disabled="!hasThemeAndDomain" />
    </div>
    <div class="flexrow boxrow">
      <!-- This one is really just an oracle roll with some description -->
      <SiteMovebox movename="Find an Opportunity" />
      <button
        type="button"
        class="box flexrow clickable block"
        @click="locateObjective"
      >
        <h4>
          {{ $t('IRONSWORN.MoveContents.Locate Your Objective.title') }}
        </h4>
      </button>
      <SiteMovebox movename="Escape the Depths" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { SiteDataPropertiesData } from '../../../actor/actortypes'
import { createIronswornChatRoll } from '../../../chat/chatrollhelpers'
import { moveDataByName } from '../../../helpers/data'
import {
  DelveThemeDataSourceData,
  FeatureOrDanger,
} from '../../../item/itemtypes'
import { TableRow, OracleRollMessage } from '../../../rolls'
import { $ActorKey } from '../../provisions'

import SiteMovebox from './site-movebox.vue'

const site = inject($ActorKey)

const theme = computed(() => {
  return site?.items.find((x) => x.type === 'delve-theme')
})
const domain = computed(() => {
  return site?.items.find((x) => x.type === 'delve-domain')
})

const hasThemeAndDomain = computed(() => {
  return !!(theme.value && domain.value)
})

async function randomFeature() {
  if (!hasThemeAndDomain.value) return

  const themeData = theme.value?.system as DelveThemeDataSourceData
  const domainData = domain.value?.system as DelveThemeDataSourceData
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
  const subtitle = `${site?.name} – ${theme.value?.name} ${domain.value?.name}`
  const orm = await OracleRollMessage.fromRows(rows, title, subtitle)
  orm.createOrUpdate()
}

async function locateObjective() {
  if (!site) return
  const move = await moveDataByName('Locate Your Objective')
  const siteSys = site.system as SiteDataPropertiesData
  const progress = Math.floor(siteSys.current / 4)
  const roll = new Roll(`{${progress}, d10, d10}`)
  createIronswornChatRoll({
    isProgress: true,
    move,
    roll,
    subtitle: site.name || undefined,
  })
}
</script>
