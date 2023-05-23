<template>
	<IronCheckbox
		is="button"
		type="button"
		:data-tooltip="state.hintText"
		class="flexrow"
		:class="{ [$style.hint]: !!state.hintText, [$style.wrapper]: true }"
		:checked="checked"
		:aria-labelledby="`label_${baseId}`"
		:transition="IronswornSettings.deco.impact.transition"
		@change="input">
		<template #checked="scope">
			<FontIcon
				v-bind="{ ...scope, ...IronswornSettings.deco.impact.checked }" />
		</template>
		<template #unchecked="scope">
			<FontIcon
				v-bind="{
					...scope,
					...IronswornSettings.deco.impact.unchecked
				}" />
		</template>
		<slot :id="`label_${baseId}`" name="default">
			<span :id="`label_${baseId}`" :class="$style.label">
				{{ label }}
			</span>
		</slot>
	</IronCheckbox>
</template>

<script lang="ts" setup>
import { computed, capitalize, inject, nextTick, reactive } from 'vue'
import type { Ref } from 'vue'
import { actorsOrAssetsWithConditionEnabled } from '../../../helpers/globalConditions'
import { IronswornSettings } from '../../../helpers/settings'
import type { AssetDataPropertiesData } from '../../../item/itemtypes'
import { $ActorKey, ActorKey } from '../../provisions'
import IronCheckbox from '../input/iron-checkbox.vue'
import FontIcon from '../icon/font-icon.vue'
import type { IronswornActor } from '../../../actor/actor'
import type { ActorSource } from '../../../fields/utils'

const actor = inject(ActorKey) as Ref<ActorSource<'character'>>
const $actor = inject($ActorKey) as IronswornActor<'character'>

const baseId = computed(() => `condition_${props.name}_${actor.value._id}`)

const props = defineProps<{
	name: string
	type: 'impact' | 'debility'
	global?: boolean
	globalHint?: boolean
}>()

const statusId = computed(() => `${props.type}_${props.name}`)
const effectData = computed(() =>
	CONFIG.statusEffects.find((fx) => fx.id === statusId.value)
)
const checked = computed(() =>
	actor.value.effects.some((fx) => fx.flags.core?.statusId === statusId.value)
)

const state = reactive<{ hintText?: string }>({})

async function input() {
	if (effectData.value == null) throw new Error()

	$actor?.system.toggleActiveEffect(
		effectData.value as { id: string; label: string; icon: string },
		{}
	)
	await nextTick()

	// if (props.global) {
	// 	await IronswornSettings.updateGlobalAttribute(data, [
	// 		'character',
	// 		'starship'
	// 	])
	// }

	// if (props.globalHint) {
	// 	CONFIG.IRONSWORN.emitter.emit('globalConditionChanged', {
	// 		name: props.name,
	// 		enabled: value
	// 	})
	// }
}

// We can't watch this directly, we just have to trust that a broadcast will happen
// when it changes
CONFIG.IRONSWORN.emitter.on('globalConditionChanged', ({ name }) => {
	if (name === props.name) {
		refreshGlobalHint()
	}
})

const label = computed(() =>
	game.i18n.localize(
		`IRONSWORN.${props.type.toUpperCase()}.${capitalize(props.name)}`
	)
)
function refreshGlobalHint() {
	const { actors, assets } = actorsOrAssetsWithConditionEnabled(props.name)
	const names = [
		...actors.map((x) => x.name),
		...assets.map((x) => {
			const assetData = x.system as AssetDataPropertiesData
			const nameField = assetData.fields.find((x) => {
				const downcase = x.name.toLowerCase()
				if (downcase === game.i18n.localize('Name').toLowerCase()) return true
				if (downcase === 'name') return true
				return false
			})
			return nameField?.value || x.name
		})
	].filter((x) => x !== actor.value.name)

	if (names.length == 0) {
		state.hintText = undefined
	} else if (names.length == 1) {
		// Condition only set on one other actor
		state.hintText = game.i18n.format('IRONSWORN.ConditionMarkedOnOne', {
			condition: capitalize(label.value),
			name: names[0]
		})
	} else {
		// This condition is marked on several other actors, display them as a list
		state.hintText = `
    <p>${game.i18n.format('IRONSWORN.ConditionMarkedOnMany', {
			condition: capitalize(label.value)
		})}</p>
    <ul>
      ${names.map((x) => `<li>${x}</li>`).join('\n')}
    </ul>
    `.trim()
	}
}
if (props.globalHint) refreshGlobalHint()
</script>

<style lang="scss" module>
.wrapper {
	gap: var(--ironsworn-spacer-sm);
	align-items: center;
	line-height: 1;
	padding: var(--ironsworn-spacer-xs);
	padding-left: 0;
	flex-wrap: nowrap;
}
button:local(.wrapper) {
	// a pox upon chrome's user agent style sheet, which aggressively overrides a bunch of stuff that it shouldn't
	display: flex;
	flex-direction: row;
}
.hint {
	filter: drop-shadow(0 0 5px var(--ironsworn-color-warning));
}

.label {
	text-align: start;
	&::first-letter {
		text-transform: uppercase;
	}
}
</style>
