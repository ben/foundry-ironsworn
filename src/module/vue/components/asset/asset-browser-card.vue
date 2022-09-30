
<template>
  <article
    class="item-row flexcol ironsworn__asset"
    :class="{ [`asset-${toolset}`]: true }"
    :style="
      data.data.color
        ? `--ironsworn-color-thematic: ${data.data.color}`
        : undefined
    "
  >
    <header class="asset-header nogrow flexrow">
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

    <transition name="slide">
      <section
        v-if="state.expanded"
        class="asset-body flexcol"
        :aria-expanded="state.expanded"
        :id="bodyId"
      >
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
          <with-rolllisteners
            v-for="(ability, i) in data.data.abilities"
            :key="'ability' + i"
            element="li"
            :class="`asset-ability bullet-${toolset}`"
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
          </with-rolllisteners>
        </ul>

        <article
          class="asset-condition-meter flexcol"
          v-if="data.data.track.enabled"
        >
          <h4>{{ data.data.track.name }}</h4>
          <asset-track :item="foundryItem.toObject(true)" />
        </article>
      </section>
    </transition>
  </article>
</template>

<style lang="less" scoped>
</style>

<script setup lang="ts">
import { IAsset } from 'dataforged'
import { inject, reactive } from 'vue'
import { IronswornItem } from '../../../item/item'
import { AssetDataProperties } from '../../../item/itemtypes'
import AssetTrack from './asset-track.vue'

const props = defineProps<{
  df: IAsset
  foundryItem: Readonly<IronswornItem>
}>()
const data = props.foundryItem.data as AssetDataProperties

const state = reactive({
  expanded: false,
})

const bodyId = `asset-body-${props.foundryItem.id}`
const toolset = inject('toolset')

function moveClick() {
  // TODO:
}
</script>
