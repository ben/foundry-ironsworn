<template>
  <div class="flexcol">
    <!-- HEADER -->
    <SheetHeaderBasic class="nogrow" :document="actor" />
    <div class="flexrow nogrow" style="gap: 10px">
      <div class="flexcol" style="flex-basis: 20em">
        <!-- RANK -->
        <div class="flexrow nogrow">
          <RankPips
            :current="actor.system.rank"
            class="nogrow"
            @click="setRank"
            style="margin-right: 1em"
          />
          <h4 style="margin: 0; line-height: 22px">{{ rankText }}</h4>
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
          :ticks="actor.system.current"
          :rank="actor.system.rank"
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
          </div>
          <div class="flexrow boxrow nogrow">
            <SiteDroparea
              class="box"
              :item="domain"
              item-type="delve-domain"
              compendium-key="ironsworndelvedomains"
              title-key="IRONSWORN.Domain"
            />
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
          </div>
          <div class="flexrow boxrow">
            <SiteDenizenbox :idx="2" :ref="(e) => (denizenRefs[2] = e)" />
            <SiteDenizenbox :idx="3" :ref="(e) => (denizenRefs[3] = e)" />
          </div>
          <div class="flexrow boxrow">
            <SiteDenizenbox :idx="4" :ref="(e) => (denizenRefs[4] = e)" />
            <SiteDenizenbox :idx="5" :ref="(e) => (denizenRefs[5] = e)" />
          </div>
          <div class="flexrow boxrow">
            <SiteDenizenbox :idx="6" :ref="(e) => (denizenRefs[6] = e)" />
            <SiteDenizenbox :idx="7" :ref="(e) => (denizenRefs[7] = e)" />
          </div>
          <div class="flexrow boxrow">
            <SiteDenizenbox :idx="8" :ref="(e) => (denizenRefs[8] = e)" />
            <SiteDenizenbox :idx="9" :ref="(e) => (denizenRefs[9] = e)" />
          </div>
          <div class="flexrow boxrow">
            <SiteDenizenbox :idx="10" :ref="(e) => (denizenRefs[10] = e)" />
            <SiteDenizenbox :idx="11" :ref="(e) => (denizenRefs[11] = e)" />
          </div>
        </div>
      </div>
      <div class="flexcol" style="flex-basis: 10em; margin: 10px 0">
        <!-- MOVES -->
        <SiteMoves />
      </div>
    </div>
    <div class="flexcol">
      <!-- NOTES -->
      <h4 class="nogrow">{{ $t('IRONSWORN.Notes') }}</h4>
      <MceEditor v-model="actor.system.description" @save="saveDescription" />
    </div>
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
import { $ActorKey, ActorKey } from './provisions'
import RankPips from './components/rank-pips/rank-pips.vue'
import BtnCompendium from './components/buttons/btn-compendium.vue'
import BtnFaicon from './components/buttons/btn-faicon.vue'
import SiteDroparea from './components/site/site-droparea.vue'
import SiteDenizenbox from './components/site/site-denizenbox.vue'
import MceEditor from './components/mce-editor.vue'
import BtnIsicon from './components/buttons/btn-isicon.vue'
import { RANKS, RANK_INCREMENTS } from '../constants'
import { createIronswornDenizenChat } from '../chat/chatrollhelpers'
import ProgressTrack from './components/progress/progress-track.vue'
import SiteMoves from './components/site/site-moves.vue'

const props = defineProps<{
  actor: any
}>()

provide(ActorKey, computed(() => props.actor) as any)
provide('toolset', 'ironsworn')

const $actor = inject($ActorKey)

const editMode = computed(() => {
  return (props.actor.flags['foundry-ironsworn'] as any)?.['edit-mode']
})

const theme = computed(() => {
  return props.actor.items.find((x) => x.type === 'delve-theme')
})

const domain = computed(() => {
  return props.actor.items.find((x) => x.type === 'delve-domain')
})

const rankText = computed(() => {
  return game.i18n.localize(RANKS[props.actor.system.rank])
})

function setRank(rank) {
  $actor?.update({ system: { rank } })
}

function clearProgress() {
  $actor?.update({ 'system.current': 0 })
}

function markProgress() {
  const increment = RANK_INCREMENTS[props.actor.system.rank]
  const newValue = Math.min(props.actor.system.current + increment, 40)
  $actor?.update({ 'system.current': newValue })
}

const denizenRefs = ref<{ [k: number]: any }>({})
async function randomDenizen() {
  const roll = await new Roll('1d100').evaluate({ async: true })
  const result = roll.total
  const denizen = props.actor.system.denizens.find(
    (x) => x.low <= result && x.high >= result
  )
  if (!denizen) throw new Error(`Rolled a ${result} but got no denizen???`)
  const idx = props.actor.system.denizens.indexOf(denizen)
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
  $actor?.update({ 'system.description': props.actor.system.description })
}
</script>
