<template>
  <article
    class="item-row document ironsworn__asset"
    draggable="true"
    :data-pack="foundryItem.pack"
    :data-id="foundryItem.id"
    :data-document-id="foundryItem.id"
    :class="{ [`asset-${toolset}`]: true }"
    :style="
      data.data.color
        ? `--ironsworn-color-thematic: ${data.data.color}`
        : undefined
    "
    @dragstart="dragStart"
  >
    <header class="asset-header nogrow flexrow">
      <i class="fa-solid fa-grip nogrow block draggable item"></i>

      <button
        type="button"
        @click="state.expanded = !state.expanded"
        :aria-controls="bodyId"
        class="clickable text asset-expand-toggle"
      >
        <h4 class="asset-title">
          {{ foundryItem.name }}
        </h4>
      </button>
    </header>

    <CollapseTransition>
      <section
        v-if="state.expanded"
        class="asset-body flexcol"
        :aria-expanded="state.expanded"
        :id="bodyId"
      >
        <div
          v-html="$enrichHtml(data.data.description ?? '')"
          v-if="data.data.description"
        ></div>
        <div v-html="$enrichHtml(data.data.requirement ?? '')"></div>

        <dl class="asset-fields" v-if="data.data.fields?.length">
          <div
            class="asset-field"
            v-for="(field, i) in data.data.fields"
            :key="'field' + i"
          >
            <dt class="asset-field-label">{{ field.name }}</dt>
            <dd class="asset-field-value">{{ field.value }}</dd>
          </div>
        </dl>

        <ul class="asset-abilities flexcol">
          <WithRolllisteners
            v-for="(ability, i) in data.data.abilities"
            :key="'ability' + i"
            element="li"
            :class="{
              'asset-ability': true,
              [`bullet-${toolset}`]: true,
              marked: ability.enabled,
            }"
            @moveclick="moveClick"
          >
            <div
              class="asset-ability-text flexcol"
              v-html="$enrichHtml(ability.description)"
            ></div>
            <clock
              v-if="ability.hasClock"
              class="asset-ability-clock"
              :wedges="ability.clockMax"
              :ticked="ability.clockTicks"
            />
          </WithRolllisteners>
        </ul>
        <AttrSlider
          v-if="data.data.track.enabled"
          attr="track"
          documentType="Item"
          sliderStyle="horizontal"
          :max="data.data.track.max"
          :currentValue="data.data.track.current"
          :read-only="true"
        >
          <template #label>
            <label>{{ data.data.track.name }}</label>
          </template>
        </AttrSlider>
      </section>
    </CollapseTransition>
  </article>
</template>

<style lang="less" scoped>
.ironsworn .ironsworn__asset {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  margin: 10px 0;
  padding: 5px;
}
</style>

<script setup lang="ts">
import { IAsset } from 'dataforged'
import { computed, inject, provide, reactive } from 'vue'
import { IronswornItem } from '../../../item/item'
import { AssetDataProperties } from '../../../item/itemtypes'
import Clock from '../clock.vue'
import WithRolllisteners from '../with-rolllisteners.vue'
import CollapseTransition from '../transition/collapse-transition.vue'
import AttrSlider from '../resource-meter/attr-slider.vue'
import { $ItemKey, ItemKey } from '../../provisions.js'

const props = defineProps<{
  df?: IAsset
  foundryItem: Readonly<IronswornItem>
}>()

const toolset = inject('toolset')
const data = props.foundryItem.data as AssetDataProperties
provide($ItemKey, props.foundryItem)
provide(
  ItemKey,
  computed(() => props.foundryItem.toObject() as any)
)

const state = reactive({
  expanded: false,
})

const bodyId = `asset-body-${props.foundryItem.id}`

function moveClick(item) {
  CONFIG.IRONSWORN.emitter.emit('highlightMove', item.id)
}

function dragStart(ev) {
  ev.dataTransfer.setData(
    'text/plain',
    JSON.stringify({
      type: 'AssetBrowserData',
      pack: props.foundryItem.pack || undefined,
      id: props.foundryItem.id,
      uuid: props.foundryItem.uuid,
    })
  )
}
</script>
