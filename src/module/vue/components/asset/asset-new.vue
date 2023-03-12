<template>
  <article :class="$style.ironsworn__asset">
    <slot name="header">
      <AssetHeader />
    </slot>

    <slot name="description" v-if="asset.system.description">
      <WithRolllisteners
        element="div"
        v-html="$enrichHtml(asset.system.description ?? '')"
        @moveclick="moveClick"
      />
    </slot>
    <slot name="requirement" v-if="asset.system.requirement">
      <WithRolllisteners
        element="div"
        v-html="$enrichMarkdown(asset.system.requirement ?? '')"
        @moveclick="moveClick"
      />
    </slot>

    <slot name="fields">
      <AssetField></AssetField>
    </slot>
    <slot name="default">
      <!-- asset main content -->
      <ul :class="$style['asset-abilities']" class="flexcol">
        <slot name="abilites"> </slot>
      </ul>
    </slot>
    <slot name="options" v-if="asset.system.exclusiveOptions > 0">
      <AssetOptions class="nogrow" />
    </slot>
    <slot
      name="conditionMeter"
      v-if="asset.system.track.enabled || asset.system.conditions?.length > 0"
    >
      <AssetConditionMeter class="nogrow" :asset="asset" :readOnly="readOnly" />
    </slot>
  </article>
</template>

<style lang="scss" module>
.ironsworn__asset {
  transition: var(--ironsworn-transition);
  overflow: hidden;
}

.asset-abilities {
}
</style>

<script lang="ts" setup>
import AssetHeader from 'components:asset/asset-header.vue'
import AssetConditionMeter from 'components:asset/asset-condition-meter.vue'
import AssetOptions from 'components:asset/asset-options.vue'
import WithRolllisteners from 'component:with-rolllisteners.vue'
import { inject } from 'vue'
import { $ItemKey } from 'module/vue/provisions'

const props = withDefaults(
  defineProps<{
    asset: any
    /**
     * If the actor is omitted, the asset is rendered for static display.
     */
    actor?: any
    readOnly?: boolean
  }>(),
  {}
)

const $asset = inject($ItemKey)

function moveClick(item) {
  CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}

function saveFields() {
  const fields = props.asset.value?.system.fields
  $asset?.update({ system: { fields } })
}
</script>
