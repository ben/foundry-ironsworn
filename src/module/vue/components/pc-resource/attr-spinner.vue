<template>
  <article
    class="attr-spinner"
    :class="{ [`label-${labelPosition}`]: true }"
    :aria-labelledby="`${baseId}-label`"
    ref="$wrapper"
    :aria-orientation="spinnerStyle !== 'compact' ? spinnerStyle : undefined"
  >
    <!-- spinbutton role: "A form of range that expects the user to select from among discrete choices." -->
    <section
      v-if="labelPosition != 'none'"
      class="attr-spinner-label nogrow"
      :id="`${baseId}-label`"
    >
      <!-- TODO: should this be an heading tag? -->
      <slot name="label">
        <!-- button or static label goes here -->
        <!-- the tabindex for this item should be -1 -->
      </slot>
    </section>
    <slot name="default"></slot>
    <SpinnerBar
      class="attr-spinner-bar"
      ref="$spinner"
      :orientation="spinnerStyle !== 'compact' ? spinnerStyle : undefined"
      :max="props.max"
      :min="props.min ?? 0"
      :softMax="props.softMax"
      :initial-value="props.initialValue"
      :segmentClass="segmentClass"
      @change="onChange"
    >
    </SpinnerBar>
  </article>
</template>

<style lang="less">
@segment_border_width: 1px;
@segment_border_radius: 5px;

.attr-spinner {
  &[aria-orientation='vertical'] {
    display: grid;
    grid-auto-flow: column;
    place-items: start;
    grid-template-columns: max-content max-content;
    grid-template-rows: max-content max-content max-content;
    .attr-spinner-label {
      grid-row: 1;
      max-height: 50%;
    }
    .attr-spinner-bar {
      grid-row: 1;
    }
    &.label-none {
      display: flex;
    }
    &.label-left {
      .attr-spinner-label {
        grid-column: 1;
      }
    }
    &.label-right {
      .attr-spinner-label {
        grid-column: 2;
      }
    }
  }
  &[aria-orientation='horizontal'] {
    display: flex;
    flex-flow: row wrap;
    justify-items: space-between;
    .attr-spinner-label {
      > * {
        padding-inline-end: @segment_border_radius;
      }
    }
  }
  &:focus {
    outline: none;
    // background: #0001;
  }
  .attr-spinner-label {
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
 * A spinner that controls the value of an attribute.
 */
import { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import { computed, ref } from 'vue'
import { pickInjectedDocument } from '../../composable/pickInjectedDocument.js'
import SpinnerBar from './spinner-bar.vue'

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
    min?: number
    softMax?: number
    initialValue: number
    spinnerStyle?: 'vertical' | 'horizontal' | 'compact'
    labelPosition?: 'right' | 'left' | 'none'
    /**
     * @see {@link SpinnerBar} props for more info
     */
    segmentClass?: Record<number, any>
  }>(),
  { spinnerStyle: 'vertical', labelPosition: 'left' }
)

const { $document } = pickInjectedDocument(props.documentType)

const $wrapper = ref<HTMLElement>()
const $spinner = ref<HTMLElement>()

//  TODO: this isn't generating properly
const baseId = computed(
  () => `${$document?._id ?? $document?.id}-attr-spinner-${props.attr}`
)

function onChange(newValue: number) {
  $document?.update({
    data: { [props.attr]: newValue },
  })
}

// watch(state, ({ current }) => {
//   $document?.update({
//     data: { [props.attr]: clampedValue(current) },
//   })
// })
</script>
