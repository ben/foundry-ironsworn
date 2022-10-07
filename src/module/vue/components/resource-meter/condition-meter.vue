<template>
  <AttrSlider
    class="condition-meter"
    :documentType="documentType"
    :attr="props.attr"
    :sliderStyle="sliderStyle"
    :current-value="currentValue"
    :min="0"
    :max="max"
    :softMax="softMax"
    :read-only="readOnly"
    :global="global"
  >
    <template #label>
      <BtnRollstat
        v-if="labelPosition != 'none'"
        tabindex="0"
        :documentType="documentType"
        class="text"
        :class="{ vertical: sliderStyle === 'vertical' }"
        :attr="attr"
        :statLabel="statLabel"
      >
        {{ statLabel }}
      </BtnRollstat>
    </template>
  </AttrSlider>
</template>

<script setup lang="ts">
import AttrSlider from './attr-slider.vue'
import { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import BtnRollstat from '../buttons/btn-rollstat.vue'
import { inject } from 'vue'
import { ItemKey } from '../../provisions.js'

const props = withDefaults(
  defineProps<{
    /**
     * The key of the attribute controlled by the slider. This is the property of the injected document that will be controlled.
     */
    attr: string
    /**
     * The type of injectable document to use. Currently only "Actor" and "Item" work - they'll target `$ActorKey` or `$ItemKey` as appropriate.
     *
     * @see {$ActorKey}
     * @see {$ItemKey}
     */
    documentType: DocumentType
    /**
     * When 'true' and documentType is set to "Actor", updates *all* actors of the 'shared' and 'character' types.
     */
    global?: boolean
    max: number
    softMax?: number
    currentValue: number
    sliderStyle?: 'vertical' | 'horizontal'
    labelPosition?: 'right' | 'left' | 'none'
    /**
     * This string will be inserted in into the tooltip text "Roll +{x}" on the roll button. It should already be localized.
     */
    statLabel: string
    readOnly?: boolean
  }>(),
  {
    sliderStyle: 'vertical',
    labelPosition: 'left',
    readOnly: false,
    global: false,
  }
)

const item = inject(ItemKey)
</script>
