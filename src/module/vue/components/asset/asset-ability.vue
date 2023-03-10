<template>
  <IronCheckbox
    :is="is"
    :class="$style.wrapper"
    ref="$el"
    :checked="$props.ability.enabled"
    v-bind="{
      iconChecked,
      iconUnchecked,
    }"
    :readonly="readonly"
    class="flexrow"
    @input="$emit('toggleEnabled', $event)"
  >
    <slot name="default">
      <WithRolllisteners
        element="div"
        @moveclick="moveClick"
        :class="$style.text"
        class="flexcol"
        v-html="$enrichHtml($props.ability.description)"
      >
      </WithRolllisteners>
    </slot>
    <slot name="clock">
      <Clock
        v-if="$props.ability.hasClock"
        :class="$style.clock"
        :wedges="$props.ability.clockMax"
        :ticked="$props.ability.clockTicks"
        @click.prevent="$emit('setClock', $event)"
      />
    </slot>
  </IronCheckbox>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: row;
  gap: var(--ironsworn-spacer-lg);
  list-style: none;
}
.clock {
  --ironsworn-clock-size-min: 40px;
  --ironsworn-clock-size-max: 75px;

  min-width: var(--ironsworn-clock-size-min);
  max-width: var(--ironsworn-clock-size-max);
  min-height: var(--ironsworn-clock-size-min);
  max-height: var(--ironsworn-clock-size-max);
}
.text {
  p {
    margin: 0;
  }
  ul,
  ol {
    margin: 0;
  }
}
.wrapper[aria-readonly='true'] :local(.text) {
  pointer-events: initial;
}
</style>

<script lang="ts" setup>
import Clock from 'component:clock.vue'
import { IconId } from 'component:icon/icon-common'
import IronCheckbox from 'component:input/iron-checkbox.vue'
import WithRolllisteners from 'component:with-rolllisteners.vue'
import type { AssetAbility as AssetAbilityType } from 'module/item/itemtypes'
import { getCssVar } from '../../composable/getCssVar'
import { computed, ref } from 'vue'

interface Props {
  readonly?: boolean
  ability: AssetAbilityType
  is?: any
}

const props = withDefaults(defineProps<Props>(), { readonly: false, is: 'div' })

const cssVarSource = document.documentElement.querySelector('body') as any

const iconChecked = computed(
  () => ({
    icon: getCssVar<IconId>(
      '--ironsworn-asset-ability-bullet-checked',
      // FIXME this should really point to the wrapper element
      cssVarSource
    ),
    class: getCssVar(
      '--ironsworn-asset-ability-bullet-checked-classes',
      cssVarSource
    ),
  })
  // FIXME: ideally this would point at a specific ability's computed value. but this will have to wait for an asset ability component.
)
let $el = ref<HTMLElement>()

const iconUnchecked = computed(() => ({
  icon: getCssVar<IconId>(
    '--ironsworn-asset-ability-bullet-unchecked',
    cssVarSource
  ),
  class: getCssVar(
    '--ironsworn-asset-ability-bullet-unchecked-classes',
    cssVarSource
  ),
}))

function moveClick(item) {
  CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}

const $emit = defineEmits<{
  (event: 'setClock', clockValue: number): void
  (event: 'toggleEnabled', value: boolean): void
}>()
</script>