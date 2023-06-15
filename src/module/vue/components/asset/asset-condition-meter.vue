<template>
	<article :class="{ [$style.wrapper]: true, [$style.readonly]: readonly }">
		<ConditionMeter
			v-if="asset.system.track.enabled"
			slider-style="horizontal"
			:class="$style.meter"
			document-type="Item"
			attr="track"
			:max="asset.system.track.max"
			:min="asset.system.track.min"
			:stat-label="asset.system.track.name"
			label-position="left"
			:read-only="readonly" />
		<div v-if="asset.system.conditions?.length > 0" :class="$style.conditions">
			<label
				v-for="(condition, i) in asset.system.conditions"
				:key="condition.name"
				:class="$style.condition">
				<input
					type="checkbox"
					:checked="condition.ticked"
					:readonly="readonly"
					@change="toggleCondition(i)" />
				{{ condition.name }}
			</label>
		</div>
	</article>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import { ItemKey, $ItemKey, ActorKey, $ActorKey } from '../../provisions'
import ConditionMeter from 'component:resource-meter/condition-meter.vue'
import { IronswornItem } from '../../../item/item'

const asset = inject(ItemKey) as Ref<ItemSource<'asset'>>
const $asset = inject($ItemKey) as IronswornItem<'asset'>

const actor = inject(ActorKey, undefined)
const $actor = inject($ActorKey, undefined)

const readonly = computed(() => !actor?.value)

async function toggleCondition(idx: number) {
	if (readonly.value) return
	const { conditions } = asset.value.system
	conditions[idx].ticked = !conditions[idx].ticked
	await $asset?.update({ system: { conditions } })

	CONFIG.IRONSWORN.emitter.emit('globalConditionChanged', {
		name: conditions[idx].name.toLowerCase(),
		enabled: conditions[idx].ticked
	})
}
</script>

<style lang="scss" module>
@use 'mixin:text.scss';

.readonly {
	pointer-events: none;
}

.wrapper {
}

.meter {
	gap: var(--ironsworn-spacer-sm);

	.icon-button .button-text {
		text-align: left;
	}

	.slider-segment {
		--ironsworn-text-stroke-color: var(--ironsworn-dark-color);

		@include text.stroke;
	}
}

.conditions {
	display: flex;
	flex-direction: column;
	flex-grow: 0;
	justify-content: space-around;
	margin: var(--ironsworn-spacer-md);
}

.condition {
	--ironsworn-checkbox-size: 12px;

	flex-basis: var(--ironsworn-checkbox-size);
	margin: var(--ironsworn-border-width-md) 0;
	line-height: var(--ironsworn-checkbox-size);
	white-space: nowrap;
	font-size: x-small;

	input[type='checkbox'] {
		flex: 0 0 var(--ironsworn-checkbox-size);
		margin: 0 var(--ironsworn-spacer-sm);
		width: var(--ironsworn-checkbox-size);
		height: var(--ironsworn-checkbox-size);
		vertical-align: bottom;
	}
}
</style>
