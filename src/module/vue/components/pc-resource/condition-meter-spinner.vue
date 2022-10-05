<template>
  <AttrSpinner
    class="condition-meter-spinner"
    :documentType="documentType"
    :attr="attr"
    :spinnerStyle="spinnerStyle"
    :initial-value="initialValue"
    :min="0"
    :max="max"
    :softMax="softMax"
  >
    <template #label>
      <BtnRollStat
        v-if="labelPosition != 'none'"
        tabindex="0"
        :documentType="documentType"
        class="text"
        :class="{ 'vertical-v2': spinnerStyle === 'vertical' }"
        :attr="attr"
      >
        {{ buttonLabel }}
      </BtnRollStat>
    </template>
  </AttrSpinner>
</template>

<style lang="less"></style>

<script setup lang="ts">
import BtnRollStat from '../buttons/btn-roll-stat.vue'
import AttrSpinner from '../resource-meters/attr-spinner.vue'
import { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'

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
    buttonLabel?: string | undefined
  }>(),
  {
    spinnerStyle: 'vertical',
    labelPosition: 'right',
  }
)
</script>
