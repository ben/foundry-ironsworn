<template>
	<AttrSlider
		class="momentum-meter"
		attr="momentum"
		document-type="Actor"
		:label-position="labelPosition"
		:slider-style="props.sliderStyle"
		:current-value="actorSys.momentum ?? 2"
		:min="-6"
		:max="10"
		:soft-max="actorSys.momentumMax"
		:segment-class="{
			[actorSys.momentumReset]: 'segment-momentum-reset'
		}">
		<template #label>
			<BtnMomentumburn
				:vertical="sliderStyle === 'vertical'"
				:text="$t('IRONSWORN.Momentum')"
				:tooltip="
					$t('IRONSWORN.BurnMomentumAndResetTo', {
						value: actorSys.momentum,
						resetValue: actorSys.momentumReset
					})
				">
			</BtnMomentumburn>
		</template>
	</AttrSlider>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import type { IronswornActor } from '../../../actor/actor.js'
import type {
	CharacterDataProperties,
	CharacterDataPropertiesData
} from '../../../actor/actortypes.js'
import { ActorKey } from '../../provisions.js'
import BtnMomentumburn from '../buttons/btn-momentumburn.vue'

import AttrSlider from './attr-slider.vue'

const props = withDefaults(
	defineProps<{
		sliderStyle?: 'horizontal' | 'vertical'
		labelPosition?: 'right' | 'left'
	}>(),
	{ sliderStyle: 'vertical', labelPosition: 'left' }
)

const actor = inject(ActorKey) as Ref<
	ReturnType<typeof IronswornActor.prototype.toObject> & CharacterDataProperties
>
const actorSys = computed(
	() => (actor.value as any)?.system as CharacterDataPropertiesData
)
</script>

<style lang="scss">
@use 'mixin:clickable.scss';

.momentum-meter {
	text-transform: uppercase;

	gap: var(--ironsworn-spacer-md) 0;

	.attr-slider-label:hover ~ .slider-bar {
		.segment-momentum-reset {
			@include clickable.blockHover;
			box-shadow: 0 0 5px var(--ironsworn-color-warm) inset;
		}
	}
}
</style>
