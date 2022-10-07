<template>
  <article
    class="attr-slider"
    :class="{ [`label-${labelPosition}`]: true }"
    :aria-labelledby="`${baseId}-label`"
    :aria-orientation="sliderStyle !== 'compact' ? sliderStyle : undefined"
  >
    <section
      v-if="labelPosition != 'none'"
      class="attr-slider-label nogrow"
      :id="`${baseId}-label`"
    >
      <slot name="label">
        <!-- button or static label goes here -->
        <!-- the tabindex for this item should be -1 -->
      </slot>
    </section>
    <slot name="default"></slot>
    <SliderBar
      class="attr-slider-bar"
      :orientation="sliderStyle !== 'compact' ? sliderStyle : undefined"
      :max="props.max"
      :min="props.min ?? 0"
      :softMax="props.softMax"
      :current-value="props.currentValue"
      :segmentClass="segmentClass"
      @change="onChange"
      :read-only="readOnly"
    >
    </SliderBar>
  </article>
</template>

<style lang="less">
@segment_border_width: 1px;
@segment_border_radius: 5px;

.attr-slider {
  &[aria-orientation='vertical'] {
    display: grid;
    grid-auto-flow: column;
    place-items: start;
    grid-template-columns: max-content max-content;
    grid-template-rows: max-content max-content max-content;
    .attr-slider-label {
      grid-row: 1;
      max-height: 50%;
    }
    .attr-slider-bar {
      grid-row: 1;
    }
    &.label-none {
      display: flex;
    }
    &.label-left {
      .attr-slider-label {
        grid-column: 1;
      }
    }
    &.label-right {
      .attr-slider-label {
        grid-column: 2;
      }
    }
  }
  &[aria-orientation='horizontal'] {
    display: flex;
    flex-flow: row wrap;
    justify-items: space-between;
    .attr-slider-label {
      > * {
        padding-inline-end: @segment_border_radius;
      }
    }
  }
  &:focus {
    outline: none;
    // background: #0001;
  }
  .attr-slider-label {
    text-transform: uppercase;
    line-height: 1;
    display: flex;
    align-items: center;
    > * {
      text-transform: inherit;
    }
  }
}
</style>

<script lang="ts" setup>
/**
 * A slider that controls the value of an attribute.
 */
import { Document } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/module.mjs.js'
import { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import { computed } from 'vue'
import { IronswornSettings } from '../../../helpers/settings.js'
import { pickInjectedDocument } from '../../composable/pickInjectedDocument.js'
import SliderBar from './slider-bar.vue'

const props = withDefaults(
  defineProps<{
    /**
     * The key of the attribute controlled by the slider. This is the property of the injected document that will be controlled.
     */
    attr: string
    /**
     * The type of injectable document to use. Currently only "Actor" and "Item" work - they'll target `ActorKey`/`$ActorKey` or `ItemKey`/`$ItemKey` as appropriate.
     * @see {$ActorKey}
     * @see {$ItemKey}
     */
    documentType: DocumentType
    /**
     * When 'true' and documentType is set to "Actor", updates *all* actors of the 'shared' and 'character' types.
     */
    global?: boolean
    max: number
    min?: number
    softMax?: number
    currentValue: number
    sliderStyle?: 'vertical' | 'horizontal' | 'compact'
    labelPosition?: 'right' | 'left' | 'none'
    /**
     * @see {@link sliderBar} props for more info
     */
    segmentClass?: Record<number, any>
    readOnly?: boolean
  }>(),
  {
    global: false,
    readOnly: false,
    sliderStyle: 'vertical',
    labelPosition: 'left',
  }
)

const { $document } = pickInjectedDocument(props.documentType)

const baseId = computed(() => {
  return `${$document?.id}-attr-slider-${props.attr}`
})

async function onChange(newValue: number) {
  const data = {
    data: { [props.attr]: newValue },
  }
  // redundant with the below if it's global, but fires anyway so that a single message appears in the chatlog.
  $document?.update(data)
  if (props.global) {
    await IronswornSettings.updateGlobalAttribute(data)
  }
}
</script>
