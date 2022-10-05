<template>
  <div class="flexcol">
    <!-- HEADER -->
    <SheetHeaderBasic class="nogrow" :document="actor" />

    <!-- RANK -->
    <div class="flexrow nogrow">
      <RankPips
        :current="actor.data.rank"
        class="nogrow"
        @click="setRank"
        style="margin-right: 1em"
      />
      <h4>{{ rankText }}</h4>
      <BtnFaicon
        class="block nogrow"
        v-if="editMode"
        icon="trash"
        @click="clearProgress"
      />
      <BtnFaicon
        class="block nogrow"
        icon="caret-right"
        @click="markProgress"
      />
    </div>

    <!-- PROGRESS -->
    <ProgressTrack
      class="nogrow"
      style="margin-bottom: 1em"
      :ticks="actor.data.current"
      :rank="actor.data.rank"
    />

    <!-- THEME/DOMAIN -->
    <div class="boxgroup flexcol nogrow" style="margin-bottom: 1em">
      <div class="flexrow boxrow nogrow">
        <SiteDroparea
          class="box"
          :item="theme"
          item-type="delve-theme"
          compendium-key="ironsworndelvethemes"
          title-key="IRONSWORN.Theme"
        />
        <SiteDroparea
          class="box"
          :item="domain"
          item-type="delve-domain"
          compendium-key="ironsworndelvedomains"
          title-key="IRONSWORN.Domain"
        />
      </div>
    </div>

    <!-- MOVES -->
    <h4 class="flexrow nogrow">{{ $t('IRONSWORN.Moves') }}</h4>
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

        <SiteMovebox
          movename="Reveal a Danger"
          :disabled="!hasThemeAndDomain"
        />
      </div>
      <div class="flexrow boxrow">
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

    <!-- DENIZENS -->
    <h4 class="flexrow nogrow">
      <span>{{ $t('IRONSWORN.Denizens') }}</span>
      <BtnIsicon
        icon="d10-tilt"
        class="flexrow nogrow text"
        style="padding: 2px"
        @click="randomDenizen"
      />
      <BtnCompendium compendium="ironswornfoes" class="nogrow" />
    </h4>
    <div class="boxgroup nogrow" style="margin-bottom: 1em">
      <div class="flexrow boxrow">
        <SiteDenizenbox :idx="0" :ref="(e) => (denizenRefs[0] = e)" />
        <SiteDenizenbox :idx="1" :ref="(e) => (denizenRefs[1] = e)" />
        <SiteDenizenbox :idx="2" :ref="(e) => (denizenRefs[2] = e)" />
        <SiteDenizenbox :idx="3" :ref="(e) => (denizenRefs[3] = e)" />
      </div>
      <div class="flexrow boxrow">
        <SiteDenizenbox :idx="4" :ref="(e) => (denizenRefs[4] = e)" />
        <SiteDenizenbox :idx="5" :ref="(e) => (denizenRefs[5] = e)" />
        <SiteDenizenbox :idx="6" :ref="(e) => (denizenRefs[6] = e)" />
        <SiteDenizenbox :idx="7" :ref="(e) => (denizenRefs[7] = e)" />
      </div>
      <div class="flexrow boxrow">
        <SiteDenizenbox :idx="8" :ref="(e) => (denizenRefs[8] = e)" />
        <SiteDenizenbox :idx="9" :ref="(e) => (denizenRefs[9] = e)" />
        <SiteDenizenbox :idx="10" :ref="(e) => (denizenRefs[10] = e)" />
        <SiteDenizenbox :idx="11" :ref="(e) => (denizenRefs[11] = e)" />
      </div>
    </div>

    <!-- NOTES -->
    <h4 class="nogrow">{{ $t('IRONSWORN.Notes') }}</h4>
    <MceEditor
      v-model="actor.data.description"
      @save="saveDescription"
      @change="throttledSaveDescription"
    />
  </div>
</template>

<style lang="less" scoped>
.moves {
  .box {
    justify-content: center;
    padding: 5px;
  }
  h4 {
    margin: 0;
    white-space: nowrap;
  }
}

textarea {
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  resize: none;
  font-family: var(--font-primary);
}
</style>

<script setup lang="ts">
import SheetHeaderBasic from './sheet-header-basic.vue'
import { provide, computed, inject, nextTick, ref, Component } from 'vue'
import { IronswornActor } from '../actor/actor'
import { $ActorKey, ActorKey } from './provisions'
import { throttle } from 'lodash'
import DocumentImg from './components/document-img.vue'
import DocumentName from './components/document-name.vue'
import RankPips from './components/rank-pips/rank-pips.vue'
import BtnCompendium from './components/buttons/btn-compendium.vue'
import BtnFaicon from './components/buttons/btn-faicon.vue'
import Track from './components/progress/track.vue'
import SiteDroparea from './components/site/site-droparea.vue'
import SiteDenizenbox from './components/site/site-denizenbox.vue'
import SiteMovebox from './components/site/site-movebox.vue'
import MceEditor from './components/mce-editor.vue'
import BtnIsicon from './components/buttons/btn-isicon.vue'
import { RANKS, RANK_INCREMENTS } from '../constants'
import {
  createIronswornChatRoll,
  createIronswornDenizenChat,
} from '../chat/chatrollhelpers'
import { rollSiteFeature } from '../helpers/rolldialog'
import { moveDataByName } from '../helpers/data'
import {
  DelveDomainDataSource,
  DelveThemeDataSource,
  FeatureOrDanger,
} from '../item/itemtypes'
import { OracleRollMessage, TableRow } from '../rolls'
import { SiteDataProperties } from '../actor/actortypes'
import ProgressTrack from './components/progress/progress-track.vue'

const props = defineProps<{
  actor: any
}>()

provide(ActorKey, computed(() => props.actor) as any)

const $actor = inject($ActorKey)

const editMode = computed(() => {
  return (props.actor.flags['foundry-ironsworn'] as any)?.['edit-mode']
})

const theme = computed(() => {
  return props.actor.items.find((x) => x.type === 'delve-theme')
})
const ironswornTheme = computed(() => {
  return $actor?.items.find((x) => x.id === theme.value?._id)
})

const domain = computed(() => {
  return props.actor.items.find((x) => x.type === 'delve-domain')
})
const ironswornDomain = computed(() => {
  return $actor?.items.find((x) => x.id === domain.value?._id)
})

const hasThemeAndDomain = computed(() => {
  return theme.value && domain.value
})

const rankText = computed(() => {
  return game.i18n.localize(RANKS[props.actor.data.rank])
})

function setRank(rank) {
  $actor?.update({ data: { rank } })
}

function clearProgress() {
  $actor?.update({ 'data.current': 0 })
}

function markProgress() {
  const increment = RANK_INCREMENTS[props.actor.data.rank]
  const newValue = Math.min(props.actor.data.current + increment, 40)
  $actor?.update({ 'data.current': newValue })
}

async function randomFeature() {
  if (!hasThemeAndDomain.value) return

  const themeData = ironswornTheme.value?.data as DelveThemeDataSource
  const domainData = ironswornDomain.value?.data as DelveDomainDataSource
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
    ...themeData.data.features.map(convertToRow),
    ...domainData.data.features.map(convertToRow),
  ]
  const title = game.i18n.localize('IRONSWORN.Feature')
  const subtitle = `${$actor?.name} – ${ironswornTheme.value?.name} ${ironswornDomain.value?.name}`
  const orm = await OracleRollMessage.fromRows(rows, title, subtitle)
  orm.createOrUpdate()
}

async function locateObjective() {
  const move = await moveDataByName('Locate Your Objective')
  const progress = Math.floor(props.actor.data.current / 4)
  const roll = new Roll(`{${progress}, d10, d10}`)
  createIronswornChatRoll({
    isProgress: true,
    move,
    roll,
    subtitle: props.actor.name || undefined,
  })
}

const denizenRefs = ref<{ [k: number]: any }>({})
async function randomDenizen() {
  const roll = await new Roll('1d100').evaluate({ async: true })
  const result = roll.total
  const denizen = props.actor.data.denizens.find(
    (x) => x.low <= result && x.high >= result
  )
  if (!denizen) throw new Error(`Rolled a ${result} but got no denizen???`)
  const idx = props.actor.data.denizens.indexOf(denizen)
  await createIronswornDenizenChat({
    roll,
    denizen,
    site: $actor!,
  })

  // Denizen slot is empty; set focus and add a class
  if (!denizen?.description) {
    await $actor?.setFlag('foundry-ironsworn', 'edit-mode', true)
    await nextTick()
    denizenRefs.value[idx]?.focus?.()
  }
}

function saveDescription() {
  $actor?.update({ 'data.description': props.actor.data.description })
}
const throttledSaveDescription = throttle(saveDescription, 1000)
</script>
