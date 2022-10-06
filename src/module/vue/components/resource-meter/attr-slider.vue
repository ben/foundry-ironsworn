<template>
  <article
    class="attr-slider"
    :class="{ [`label-${labelPosition}`]: true }"
    :aria-labelledby="`${baseId}-label`"
    ref="$wrapper"
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
      ref="$slider"
      :orientation="sliderStyle !== 'compact' ? sliderStyle : undefined"
      :max="props.max"
      :min="props.min ?? 0"
      :softMax="props.softMax"
      :current-value="props.initialValue"
      :segmentClass="segmentClass"
      @change="onChange"
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
import { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import { computed, ref } from 'vue'
import { pickInjectedDocument } from '../../composable/pickInjectedDocument.js'
import SliderBar from './slider-bar.vue'

const props = withDefaults(
  defineProps<{
    /**
     * The key of the attribute controlled by the slider. This is the property of the injected document that will be controlled.
     */
    attr: string
    /**
     * The type of injectable document to use. Currently only "Actor" and "Item" work - they'll target `$ActorKey` or `$ItemKey` as appropriate.
     * @see {$ActorKey}
     * @see {$ItemKey}
     */
    documentType: DocumentType
    max: number
    min?: number
    softMax?: number
    initialValue: number
    sliderStyle?: 'vertical' | 'horizontal' | 'compact'
    labelPosition?: 'right' | 'left' | 'none'
    /**
     * @see {@link sliderBar} props for more info
     */
    segmentClass?: Record<number, any>
  }>(),
  { sliderStyle: 'vertical', labelPosition: 'left' }
)

const { $document, document } = pickInjectedDocument(props.documentType)

const $wrapper = ref<HTMLElement>()
const $slider = ref<HTMLElement>()

const baseId = computed(
  () => `${document?.value._id}-attr-slider-${props.attr}`
)

function onChange(newValue: number) {
  $document?.update({
    data: { [props.attr]: newValue },
  })
}
</script>
