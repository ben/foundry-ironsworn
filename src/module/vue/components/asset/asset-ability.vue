<template>
	<IronCheckbox
		:checked="ability.enabled"
		:class="{ [$style.wrapper]: true, [$style.hoverFx]: toggle && canUpdate }"
		:readonly="!(toggle && canUpdate)"
		:icon-switch-class="$style.bullet"
		:content-hover-fx="false"
		:transition="IronswornSettings.deco.asset.ability.transition"
		@change="toggleAbility"
	>
		<template #checked="scope">
			<FontIcon
				v-bind="{
					...scope,
					...IronswornSettings.deco.asset.ability.checked
				}"
			/>
		</template>
		<template #unchecked="scope">
			<FontIcon
				v-bind="{
					...scope,
					...IronswornSettings.deco.asset.ability.unchecked
				}"
			/>
		</template>
		<template #default>
			<RenderedText
				element="div"
				:class="$style.rulesText"
				class="flexcol"
				@moveclick="moveclick"
				:content="ability.description"
			/>
			<Clock
				v-if="ability.hasClock"
				:class="$style.clock"
				:wedges="ability.clockMax"
				:ticked="ability.clockTicks"
				:readonly="readonlyClock ?? !canUpdate"
				@click="updateClock($event)"
			/>
		</template>
	</IronCheckbox>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { IronswornSettings } from '../../../helpers/settings'
import type { AssetAbility } from '../../../item/subtypes/asset'
import Clock from '../clock.vue'
import FontIcon from '../icon/font-icon.vue'
import IronCheckbox from '../input/iron-checkbox.vue'
import RenderedText from 'component:rendered-text.vue'

const props = defineProps<{
	/**
	 * Can the asset ability be toggled?
	 */
	toggle?: boolean
	/**
	 * Render the asset ability clock as read-only?
	 */
	readonlyClock?: boolean
	/** NYI */
	readonlyFields?: boolean
	ability: AssetAbility
	/**
	 * A function that updates the asset ability via merge. This can safely be omitted if no interactivity is required.
	 */
	updateFn?: (delta: Partial<AssetAbility>) => Promise<unknown>
}>()

// if there's no provided update function, assume it's a statically rendered ability; the clock and the checkbox can't be manipulated
const canUpdate = computed(() => !!props.updateFn)

function moveclick(item) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}

function updateClock(newValue: number) {
	if (typeof newValue === 'number') {
		const delta: Partial<AssetAbility> = { clockTicks: newValue }
		updateAbility(delta)
	}
}

function toggleAbility() {
	if (!props.toggle) return
	updateAbility({ enabled: !props.ability.enabled })
}

function updateAbility(delta: Partial<AssetAbility>) {
	if (props.updateFn) props.updateFn(delta)
}
</script>

<style lang="scss" module>
@use 'mixin:fx.scss';
.wrapper {
	display: flex;
	flex-direction: row;
	gap: var(--ironsworn-spacer-md);
	align-self: start;
	list-style: none;
}

.hoverFx {
	position: relative;
	border-radius: var(--ironsworn-border-radius-md);
	&::before {
		@include fx.overlay;
		@include fx.accentGradient(50);

		transition: opacity var(--ironsworn-transition-timing);
		opacity: 0;
		z-index: -1;
		border-radius: inherit;
	}

	&:hover {
		&::before {
			opacity: 0.5;
		}
	}

	&:active {
		&::before {
			opacity: 1;
		}
	}
}

.clock {
	--ironsworn-clock-size-min: 40px;
	--ironsworn-clock-size-max: 75px;

	min-width: var(--ironsworn-clock-size-min);
	max-width: var(--ironsworn-clock-size-max);
	min-height: var(--ironsworn-clock-size-min);
	max-height: var(--ironsworn-clock-size-max);
}

.bullet {
	margin-top: 0.1em;

	/** Uncomment to use thematic color for checkbox fill  */
	// [data-switch-state='checked'] {
	// 	color: var(--ironsworn-color-thematic, currentcolor);
	// }
}

.rulesText {
	pointer-events: all;
	p {
		margin: 0;
	}

	ul,
	ol {
		margin: 0;
		padding-left: 1.25em;
	}
	ul li {
		list-style-type: disc;
	}
}
</style>
