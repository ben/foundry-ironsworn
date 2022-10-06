<template>
  <AttrSpinner
    class="condition-meter-spinner"
    :documentType="documentType"
    :attr="props.attr"
    :spinnerStyle="spinnerStyle"
    :initial-value="initialValue"
    :min="0"
    :max="max"
    :softMax="softMax"
  >
    <template #label>
      <BtnRollstat
        v-if="labelPosition != 'none'"
        tabindex="0"
        :documentType="documentType"
        class="text"
        :class="{ vertical: spinnerStyle === 'vertical' }"
        :attr="attr"
        :statLabel="statLabel"
      >
        {{ statLabel }}
      </BtnRollstat>
    </template>
  </AttrSpinner>
</template>

<script setup lang="ts">
import AttrSpinner from './attr-spinner.vue'
import { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import BtnRollstat from '../buttons/btn-rollstat.vue'

const props = withDefaults(
  defineProps<{
    /**
     * The key of the attribute controlled by the spinner. This is the property of the injected document that will be controlled.
     */
    attr: string
    /**
     * The type of injectable document to use. Currently only "Actor" and "Item" work - they'll target `$ActorKey` or `$ItemKey` as appropriate.
     * @see {$ActorKey}
     * @see {$ItemKey}
     */
    documentType: DocumentType
    max: number
    softMax?: number
    initialValue: number
    spinnerStyle?: 'vertical' | 'horizontal'
    labelPosition?: 'right' | 'left' | 'none'
    /**
     * This string will be inserted in into the tooltip text "Roll +{x}" on the roll button. It should already be localized.
     */
    statLabel: string
  }>(),
  {
    spinnerStyle: 'vertical',
    labelPosition: 'left',
  }
)
</script>
