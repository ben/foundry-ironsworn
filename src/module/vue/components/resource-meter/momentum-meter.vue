<template>
	<AttrSlider
		attr="momentum"
		document-type="Actor"
		:class="$style.wrapper"
		:label-position="labelPosition"
		:slider-style="props.sliderStyle"
		:bar-min="MomentumField.MIN"
		:bar-max="MomentumField.MAX"
		:max="actor.system.momentum.max"
		:bar-class="$style.bar"
		:label-class="$style.label"
		:segment-class="{
			[actor.system.momentum.resetValue]: [
				{ [$style.resetValue]: state.highlightResetValue }
			]
		}">
		<template #label>
			<BtnMomentumburn
				:class="$style.btn"
				:vertical="sliderStyle === 'vertical'"
				:text="$t('IRONSWORN.Momentum')"
				:tooltip="
					$t('IRONSWORN.BurnMomentumAndResetTo', actor.system.momentum as any)
				"
				@mouseenter="state.highlightResetValue = true"
				@mouseleave="state.highlightResetValue = false" />
		</template>
	</AttrSlider>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { reactive, inject } from 'vue'
import type { IronswornActor } from '../../../actor/actor'
import { MomentumField } from '../../../fields/MeterField'
import { $ActorKey, ActorKey } from '../../provisions.js'
import BtnMomentumburn from '../buttons/btn-momentumburn.vue'

import AttrSlider from './attr-slider.vue'

const props = withDefaults(
	defineProps<{
		sliderStyle?: 'horizontal' | 'vertical'
		labelPosition?: 'right' | 'left'
	}>(),
	{ sliderStyle: 'vertical', labelPosition: 'left' }
)

const state = reactive({
	highlightResetValue: false
})

const actor = inject(ActorKey) as Ref<ActorSource<'character'>>

const $actor = inject($ActorKey) as IronswornActor<'character'>
</script>

<style lang="scss" module>
@use 'mixin:clickable.scss';

.wrapper {
	gap: var(--ironsworn-spacer-md) 0;
}

.btn {
	text-transform: uppercase;
}
.bar {
}

.resetValue {
	--ironsworn-color-clickable-block-bg: var(
		--ironsworn-color-clickable-block-bg-hover
	);
	--ironsworn-color-clickable-block-fg: var(
		--ironsworn-color-clickable-block-fg-hover
	);

	@include clickable.blockHover;

	z-index: var(--ironsworn-z-index-highest);
	box-shadow: 0 0 5px var(--ironsworn-color-warm) inset,
		0 0 5px var(--ironsworn-color-warm) !important;
}
</style>
