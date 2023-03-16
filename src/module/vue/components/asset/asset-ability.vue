<template>
	<IronCheckbox
		is="li"
		:icon-checked="iconChecked"
		:icon-unchecked="iconUnchecked"
		:checked="ability.enabled"
		:class="$style['asset-ability']"
		@change="updateFn({ enabled: !ability.enabled })">
		<WithRolllisteners
			element="div"
			:class="$style['asset-ability-text']"
			class="flexcol"
			@moveclick="moveclick"
			v-html="$enrichHtml(ability.description)" />
		<Clock
			v-if="ability.hasClock"
			:class="$style['asset-ability-clock']"
			:wedges="ability.clockMax"
			:ticked="ability.clockTicks"
			:aria-readonly="!interactive"
			@click="updateClock($event)" />
	</IronCheckbox>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import type { Ref } from 'vue'
import type { AssetAbility } from '../../../item/itemtypes'
import { ActorKey, $ActorKey, $ItemKey, ItemKey } from '../../provisions'
import Clock from '../clock.vue'
import type { IconSwitchState } from '../icon/icon-common'
import { FontAwesome } from '../icon/icon-common'
import IronCheckbox from '../input/iron-checkbox.vue'
import WithRolllisteners from '../with-rolllisteners.vue'

const props = defineProps<{
	ability: AssetAbility
	updateFn: (delta: Partial<AssetAbility>) => Promise<void>
}>()

const item = inject(ItemKey) as Ref
const $item = inject($ItemKey)

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

// if there's no injected actor, assume it's a statically rendered ability; the clock and the checkbox can't be manipulated
const interactive = computed(() => !!actor?.value)

const iconChecked = computed<IconSwitchState>(() => ({
	icon: 'fa:hexagon',
	props: {
		rotate: FontAwesome.Rotate['90deg'],
		family: FontAwesome.Family.Solid
	}
}))
const iconUnchecked = computed<IconSwitchState>(() => ({
	icon: 'fa:hexagon',
	props: {
		rotate: FontAwesome.Rotate['90deg'],
		family: FontAwesome.Family.Regular
	}
}))

function moveclick(item) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}

function updateClock(newValue: number) {
	if (typeof newValue === 'number') {
		const delta: Partial<AssetAbility> = { clockTicks: newValue }
		props.updateFn(delta)
	}
}
</script>

<style lang="scss" module>
.asset-ability {
	display: flex;
	flex-direction: row;
	gap: var(--ironsworn-asset-spacer);
	list-style: none;
}

.asset-ability-clock {
	--ironsworn-clock-size-min: 40px;
	--ironsworn-clock-size-max: 75px;

	min-width: var(--ironsworn-clock-size-min);
	max-width: var(--ironsworn-clock-size-max);
	min-height: var(--ironsworn-clock-size-min);
	max-height: var(--ironsworn-clock-size-max);
}

.asset-ability-text {
	p {
		margin: 0;
	}

	ul,
	ol {
		margin: 0;
	}
}
</style>
