<template>
	<span
		class="flexrow nowrap"
		:data-tooltip="state.hintText"
		:aria-labelledby="`label_${baseId}`"
		:class="{ [$style.hint]: !!state.hintText, [$style.wrapper]: true }">
		<IronCheckbox
			is="button"
			:id="`checkbox_${baseId}`"
			type="button"
			class="flexrow nogrow"
			:checked="isActive"
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
		</IronCheckbox>
		<label
			:id="`label_${baseId}`"
			:for="`checkbox_${baseId}`"
			class="text clickable">
			<slot name="label">
				<span :class="$style.label">
					{{ $t((data as any).name).capitalize() }}
				</span>
			</slot>
		</label>
		<slot name="default"></slot>
	</span>
</template>

<script lang="ts" setup>
import { computed, inject, nextTick, reactive } from 'vue'
import type { Ref } from 'vue'
import { actorsOrAssetsWithConditionEnabled } from '../../../helpers/globalConditions'
import { IronswornSettings } from '../../../helpers/settings'
import { $ActorKey, ActorKey } from '../../provisions'
import IronCheckbox from '../input/iron-checkbox.vue'
import FontIcon from '../icon/font-icon.vue'
import type { IronswornActor } from '../../../actor/actor'
import type { IronActiveEffect } from '../../../active-effect/active-effect'

const actor = inject(ActorKey) as Ref<ActorSource<'character'>>
const $actor = inject($ActorKey) as IronswornActor<'character'>

type AESource = ReturnType<IronActiveEffect['toObject']> & {
	name: string
	statuses: string[]
}

const props = withDefaults(
	defineProps<{
		data: StatusEffectV11 | AESource
		/** Should a disabled ActiveEffect object be left in place on the character?
		 * @default false
		 */
		keepEffect?: boolean
	}>(),
	{ keepEffect: false }
)

const statusId = computed(
	() => (props.data as StatusEffectV11).id ?? (props.data as AESource)._id
)

const baseId = computed(() => `condition_${statusId.value}_${actor.value._id}`)

const isActive = computed(() =>
	actor.value.effects?.some(
		(fx) =>
			(fx as any).statuses.includes(statusId.value) && fx.disabled !== true
	)
)

const state = reactive<{ hintText?: string }>({})

async function input() {
	if (props.keepEffect) {
		// turning a kept effect off -- set it to disabled instead of removing it
		const effect = actor.value.effects.find((fx: any) =>
			fx.statuses.includes(statusId.value)
		) as undefined | AESource
		await $actor.updateEmbeddedDocuments('ActiveEffect', [
			{ _id: effect?._id, disabled: !effect?.disabled }
		])
	} else {
		if (props.data.flags?.['foundry-ironsworn']?.global)
			await CONFIG.IRONSWORN.IronActiveEffect.setGlobal(
				props.data as any,
				!isActive.value
			)
		else await $actor?.toggleActiveEffect(props.data as StatusEffectV11, {})
	}

	await nextTick()

	if (props.data.flags?.['foundry-ironsworn']?.globalHint) {
		console.log('sent globalImpactChanged')
		CONFIG.IRONSWORN.emitter.emit('globalImpactChanged', {
			id: statusId.value,
			enabled: isActive.value
		})
	}
}

// We can't watch this directly, we just have to trust that a broadcast will happen
// when it changes
CONFIG.IRONSWORN.emitter.on('globalImpactChanged', (data) => {
	if (data.id === statusId.value) {
		console.log('received globalImpactChanged', data)
		refreshGlobalHint()
	}
})

function refreshGlobalHint() {
	const { actors, assets } = actorsOrAssetsWithConditionEnabled(statusId.value)
	const names = [
		...actors.map((x) => x.name),
		...assets.map((x) => {
			const nameField = x.system.fields.find((x) => {
				const downcase = x.name.toLowerCase()
				if (downcase === game.i18n.localize('Name').toLowerCase()) return true
				if (downcase === 'name') return true
				return false
			})
			return nameField?.value || x.name
		})
	].filter((x) => x !== actor.value.name)

	if (names.length === 0) {
		state.hintText = undefined
	} else if (names.length === 1) {
		// Condition only set on one other actor
		state.hintText = game.i18n.format('IRONSWORN.ConditionMarkedOnOne', {
			condition: (props.data as any).name.capitalize(),
			name: names[0]
		})
	} else {
		// This condition is marked on several other actors, display them as a list
		state.hintText = `
    <p>${game.i18n.format('IRONSWORN.ConditionMarkedOnMany', {
			condition: (props.data as any).name.capitalize()
		})}</p>
    <ul>
      ${names.map((x) => `<li>${x}</li>`).join('\n')}
    </ul>
    `.trim()
	}
}
if (props.data.flags?.['foundry-ironsworn']?.globalHint) refreshGlobalHint()
</script>

<style lang="scss" module>
@use 'mixin:clickable.scss';

.wrapper {
	flex-wrap: nowrap;
	gap: var(--ironsworn-spacer-sm);
	align-items: center;
	line-height: 1;
}
button:local(.wrapper) {
	// a pox upon chrome's user agent style sheet, which aggressively overrides a bunch of stuff that it shouldn't
	display: flex;
	flex-direction: row;
	padding: 0;
}
.hint {
	filter: var(--ironsworn-filter-highlight-warm);
}

.label {
	text-align: start;
	&::first-letter {
		text-transform: uppercase;
	}
}
</style>
