<template>
	<AttrSlider
		class="momentum-meter"
		attr="momentum.value"
		document-type="Actor"
		:label-position="labelPosition"
		:slider-style="props.sliderStyle"
		:current-value="actor.system.momentum.value ?? MomentumField.INITIAL"
		:min="MomentumField.MIN"
		:max="MomentumField.MAX"
		:soft-max="$actor.system.momentumMax"
		:segment-class="{
			[$actor.system.momentumReset]: 'segment-momentum-reset'
		}">
		<template #label>
			<BtnMomentumburn
				:vertical="sliderStyle === 'vertical'"
				:text="$t('IRONSWORN.Momentum')"
				:tooltip="
					$t('IRONSWORN.BurnMomentumAndResetTo', {
						resetValue: $actor.system.momentumReset,
						value: actor.system.momentum.value
					})
				">
			</BtnMomentumburn>
		</template>
	</AttrSlider>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { inject } from 'vue'
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

const actor = inject(ActorKey) as Ref<ActorSource<'character'>>

const $actor = inject($ActorKey) as IronswornActor<'character'>
</script>

<style lang="scss">
@use 'mixin:clickable.scss';

.momentum-meter {
	gap: var(--ironsworn-spacer-md) 0;
	.attr-slider-label button {
		text-transform: uppercase;
	}
	.attr-slider-label:hover ~ .slider-bar {
		.segment-momentum-reset {
			@include clickable.blockHover;

			box-shadow: 0 0 5px var(--ironsworn-color-warm) inset;
		}
	}
}
</style>
