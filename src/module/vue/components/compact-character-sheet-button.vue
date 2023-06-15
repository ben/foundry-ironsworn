<template>
	<div
		class="box flexcol block"
		:class="{
			[$style.wrapper]: true,
			[$style.interactive]: !isMomentum,
			'isiconbg-d10-tilt': !isMomentum
		}">
		<h4 :data-tooltip="tooltip" @click="click">{{ i18nStat }}</h4>
		<h4 :data-tooltip="tooltip" @click="click">{{ value }}</h4>
		<div class="flexrow clickable" style="flex: 1; justify-content: center">
			<IronBtn icon="fa:subtract" @click="increment(-1)" />
			<IronBtn
				v-if="isMomentum"
				icon="fa:fire"
				:data-tooltip="burnMomentumTooltip"
				@click="$actor?.system.burnMomentum()" />
			<IronBtn icon="fa:plus" @click="increment(1)" />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { capitalize, computed, inject } from 'vue'
import type { IronswornActor } from '../../actor/actor'
import { IronswornPrerollDialog } from '../../rolls'
import { $ActorKey, ActorKey } from '../provisions'
import IronBtn from './buttons/iron-btn.vue'

const props = defineProps<{
	/** The property key within `Actor#system` */
	propKey: string
}>()

const isMomentum = props.propKey === 'momentum'
const i18nKey = `IRONSWORN.${capitalize(props.propKey)}`
const i18nStat = game.i18n.localize(i18nKey)
const tooltip = computed(() =>
	isMomentum
		? undefined
		: game.i18n.format('IRONSWORN.Roll +x', { stat: i18nStat })
)

const actor = inject(ActorKey) as unknown as Ref<ActorSource<'character'>>
const actorSystem = computed(() => (actor?.value as any)?.system)
const value = computed(() => actorSystem?.value?.[props.propKey])
const $actor = inject($ActorKey) as IronswornActor<'character'>

function increment(delta: number) {
	$actor?.update({ system: { [props.propKey]: value.value + delta } })
}

const burnMomentumTooltip = computed(() =>
	game.i18n.format(
		'IRONSWORN.BurnMomentumAndResetTo',
		actorSystem.value.momentum as any
	)
)

function click() {
	if (isMomentum) return
	IronswornPrerollDialog.showForStat(props.propKey, $actor)
}
</script>

<style lang="scss" module>
@use 'mixin:clickable';
@use 'mixin:text';

.interactive {
	@include clickable.interactive;

	cursor: pointer;

	&::before {
		--ironsworn-color-bg-highlight: var(--ironsworn-color-fg);

		transition: all 0.4s ease;
		opacity: 0;
		z-index: 0;
		padding: var(--ironsworn-spacer-sm);
	}

	&:hover {
		background-color: var(--ironsworn-color-clickable-block-bg-hover);

		&::before {
			opacity: 1;
			background-color: var(--ironsworn-color-fg);
		}
	}
}

.wrapper {
	--ironsworn-color-text-stroke: var(--ironsworn-color-bg);
	@include text.stroke;

	h4 {
		margin: 0;
		padding: var(--ironsworn-spacer-sm) 0;
		text-transform: uppercase;
		font-weight: bold;
	}
}
</style>
