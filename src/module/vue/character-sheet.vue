<template>
  <div class="flexcol">
    <!-- Header row -->
    <character-header />

    <!-- Main body row -->
    <div class="flexrow">
      <!-- Momentum on left -->
      <div class="flexcol margin-left">
        <div class="flexrow" style="flex-wrap: nowrap">
          <div class="flexcol stack momentum">
            <stack
              :actor="actor"
              stat="momentum"
              :top="10"
              :bottom="-6"
              :softMax="actor.data.momentumMax"
            ></stack>
            <hr class="nogrow" />
            <div>
              <btn-momentumburn class="nogrow block stack-row">
                {{ $t('IRONSWORN.Burn') }}
              </btn-momentumburn>

              {{ $t('IRONSWORN.Reset') }}: {{ actor.data.momentumReset }}
              {{ $t('IRONSWORN.Max') }}:
              {{ actor.data.momentumMax }}
            </div>
          </div>
          <h4 class="vertical-v2">{{ $t('IRONSWORN.Momentum') }}</h4>
        </div>
      </div>

      <!-- Center area -->
      <div class="flexcol">
        <!-- Attributes -->
        <div class="flexrow stats">
          <attr-box :actor="actor" attr="edge"></attr-box>
          <attr-box :actor="actor" attr="heart"></attr-box>
          <attr-box :actor="actor" attr="iron"></attr-box>
          <attr-box :actor="actor" attr="shadow"></attr-box>
          <attr-box :actor="actor" attr="wits"></attr-box>
        </div>

        <div class="flexrow">
          <div class="flexcol">
            <section class="sheet-area flexcol">
              <!-- Bonds -->
              <bonds :actor="actor"></bonds>

              <hr class="nogrow" />
              <!-- Assets -->
              <div
                class="flexcol ironsworn__drop__target"
                data-drop-type="asset"
              >
                <h4 class="nogrow">{{ $t('IRONSWORN.Assets') }}</h4>

                <transition-group name="slide" tag="div" class="nogrow">
                  <div
                    class="flexrow"
                    v-for="(asset, i) in assets"
                    :key="asset._id"
                  >
                    <order-buttons
                      v-if="editMode"
                      :i="i"
                      :length="assets.length"
                      @sortUp="assetSortUp"
                      @sortDown="assetSortDown"
                    />
                    <asset :actor="actor" :asset="asset" />
                  </div>
                </transition-group>
                <div class="flexcol nogrow" style="text-align: center">
                  <btn-compendium
                    class="block nogrow"
                    compendium="ironswornassets"
                  >
                    {{ $t('IRONSWORN.Assets') }}
                  </btn-compendium>
                </div>
              </div>
            </section>
          </div>
          <div class="flexcol">
            <!-- Vows & Progress -->
            <div
              class="flexcol sheet-area ironsworn__drop__target"
              data-drop-type="progress"
            >
              <transition-group name="slide" tag="div" class="nogrow">
                <div
                  class="flexrow nogrow"
                  v-for="(item, i) in progressItems"
                  :key="item._id"
                >
                  <order-buttons
                    v-if="editMode"
                    :i="i"
                    :length="progressItems.length"
                    @sortUp="progressSortUp"
                    @sortDown="progressSortDown"
                  />
                  <progress-box :item="item" :actor="actor" />
                </div>
              </transition-group>

              <progress-controls :actor="actor" />
            </div>

            <hr class="nogrow" />
            <h4 class="nogrow">{{ $t('IRONSWORN.Notes') }}</h4>
            <mce-editor
              v-model="actor.data.biography"
              @save="saveNotes"
              @change="throttledSaveNotes"
            />
          </div>
        </div>

        <!-- Conditions & Banes & Burdens -->
        <section class="sheet-area nogrow">
          <conditions :actor="actor" />
        </section>
      </div>

      <!-- Stats on right -->
      <div class="flexcol margin-right">
        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat
            class="nogrow vertical-v2 text"
            :actor="actor"
            attr="health"
          >
            {{ $t('IRONSWORN.Health') }}
          </btn-rollstat>
          <div class="flexcol stack health">
            <stack :actor="actor" stat="health" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat
            class="nogrow vertical-v2 text"
            :actor="actor"
            attr="spirit"
          >
            {{ $t('IRONSWORN.Spirit') }}
          </btn-rollstat>
          <div class="flexcol stack spirit">
            <stack :actor="actor" stat="spirit" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat
            class="nogrow vertical-v2 text"
            :actor="actor"
            attr="supply"
          >
            {{ $t('IRONSWORN.Supply') }}
          </btn-rollstat>
          <div class="flexcol stack supply">
            <stack :actor="actor" stat="supply" :top="5" :bottom="0"></stack>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.stat-roll {
  text-transform: uppercase;
}
.slide-enter-active,
.slide-leave-active {
  max-height: 83px;
}

textarea.notes {
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  font-family: var(--font-primary);
  resize: none;
  flex: 1;
  min-height: 150px;
}
</style>

<script setup lang="ts">
import { $ActorKey } from './provisions'
;('vue')
import AttrBox from './components/attr-box.vue'
import BtnMomentumburn from './components/buttons/btn-momentumburn.vue'
import Stack from './components/stack/stack.vue'
import btnRollstat from './components/buttons/btn-rollstat.vue'
import btnIsicon from './components/buttons/btn-isicon.vue'
import { IronswornActor } from '../actor/actor'
import { provide, computed, inject } from 'vue'
import { RollDialog } from '../helpers/rolldialog'
import CharacterHeader from './components/character-header.vue'
import XpBox from './components/xp-box.vue'
import Conditions from './components/conditions/conditions.vue'
import { throttle } from 'lodash'
import MceEditor from './components/mce-editor.vue'
import ProgressControls from './components/progress-controls.vue'
import ProgressBox from './components/progress/progress-box.vue'
import BtnCompendium from './components/buttons/btn-compendium.vue'
import Asset from './components/asset/asset.vue'
import OrderButtons from './components/order-buttons.vue'
import Bonds from './components/bonds.vue'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()

provide(
  'actor',
  computed(() => props.actor)
)

const $actor = inject($ActorKey)

const progressItems = computed(() => {
  return props.actor.items
    .filter((x) => x.type === 'progress')
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
})
const assets = computed(() => {
  return props.actor.items
    .filter((x) => x.type === 'asset')
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
})
const editMode = computed(() => {
  return props.actor.flags['foundry-ironsworn']?.['edit-mode']
})

//   'actor.data.biography'() {
//   this.saveNotes()
// },

function burnMomentum() {
  $actor?.burnMomentum()
}
function rollStat(stat) {
  RollDialog.show({ actor: $actor, stat })
}
function openCompendium(name) {
  const pack = game.packs?.get(`foundry-ironsworn.${name}`)
  pack?.render(true)
}

function saveNotes() {
  $actor?.update({ 'data.biography': props.actor.data.biography })
}
const throttledSaveNotes = throttle(saveNotes, 1000)

async function applySort(oldI, newI, sortBefore, collection) {
  const sorted = collection.sort(
    (a, b) => (a.data.sort || 0) - (b.data.sort || 0)
  )
  const updates = SortingHelpers.performIntegerSort(sorted[oldI], {
    target: sorted[newI],
    siblings: sorted,
    sortBefore,
  })
  await Promise.all(updates.map(({ target, update }) => target.update(update)))
}
function assetSortUp(i) {
  const items = $actor?.items.filter((x) => x.type === 'asset')
  applySort(i, i - 1, true, items)
}
function assetSortDown(i) {
  const items = $actor?.items.filter((x) => x.type === 'asset')
  applySort(i, i + 1, false, items)
}
function progressSortUp(i) {
  const items = $actor?.items.filter((x) => x.type === 'progress')
  applySort(i, i - 1, true, items)
}
function progressSortDown(i) {
  const items = $actor?.items.filter((x) => x.type === 'progress')
  applySort(i, i + 1, false, items)
}
</script>
