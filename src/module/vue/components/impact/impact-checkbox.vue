<template>
	<span
		class="flexrow nowrap"
		:class="{ [$style.hint]: !!state.hintText, [$style.wrapper]: true }">
		<IronCheckbox
			is="button"
			:id="`checkbox_${baseId}`"
			type="button"
			:data-tooltip="state.hintText"
			class="flexrow nogrow"
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
		</IronCheckbox>
		<label
			:id="`label_${baseId}`"
			:for="`checkbox_${baseId}`"
			class="text clickable">
			<slot name="default">
				<span :class="$style.label">
					{{ $capitalize($t(props.effectData.label as string)) }}
				</span>
			</slot>
		</label>
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
import { IronActiveEffect } from '../../../active-effect/active-effect'
import type { ActiveEffectDataProperties } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs'
import type { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'

const actor = inject(ActorKey) as Ref<ActorSource<'character'>>
const $actor = inject($ActorKey) as IronswornActor<'character'>

const baseId = computed(
	() => `condition_${props.effectData.label}_${actor.value._id}`
)

const props = withDefaults(
	defineProps<{
		effectData: PropertiesToSource<ActiveEffectDataProperties> | StatusEffect
		/** Should a disabled ActiveEffect object be left in place on the character? */
		keepEffect?: boolean
	}>(),
	{ keepEffect: false }
)

const statusId = computed(
	() =>
		((props.effectData as StatusEffect).id ??
			props.effectData.flags?.core?.statusId) as string
)

const checked = computed(() =>
	actor.value.effects.some((fx) => {
		const statuses = (fx as any).statuses as Array<string>
		return statuses.includes(statusId.value) && fx.disabled !== true
	})
)

const state = reactive<{ hintText?: string }>({})

async function input() {
	if (props.keepEffect) {
		// turning a kept effect off -- set it to disabled instead of removing it
		const effect = actor.value.effects.find((fx) =>
			(fx as any).statuses.includes(statusId.value)
		)
		await $actor.updateEmbeddedDocuments('ActiveEffect', [
			{ _id: effect?._id, disabled: !effect?.disabled }
		])
	} else {
		if (props.effectData.flags?.['foundry-ironsworn']?.global)
			await IronActiveEffect.setGlobal(
				props.effectData as StatusEffect,
				!checked.value
			)
		else await $actor?.toggleActiveEffect(props.effectData as StatusEffect, {})
	}

	await nextTick()

	if (props.effectData.flags?.['foundry-ironsworn']?.globalHint) {
		CONFIG.IRONSWORN.emitter.emit('globalConditionChanged', {
			name: props.effectData.label as string,
			enabled: checked.value
		})
	}
}

// We can't watch this directly, we just have to trust that a broadcast will happen
// when it changes
CONFIG.IRONSWORN.emitter.on('globalConditionChanged', ({ name }) => {
	if (name === props.effectData.label) {
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
			condition: props.effectData.label,
			name: names[0]
		})
	} else {
		// This condition is marked on several other actors, display them as a list
		state.hintText = `
    <p>${game.i18n.format('IRONSWORN.ConditionMarkedOnMany', {
			condition: props.effectData.label
		})}</p>
    <ul>
      ${names.map((x) => `<li>${x}</li>`).join('\n')}
    </ul>
    `.trim()
	}
}
if (props.effectData.flags?.['foundry-ironsworn']?.globalHint)
	refreshGlobalHint()
</script>

<style lang="scss" module>
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
	filter: drop-shadow(0 0 5px var(--ironsworn-color-warning));
}

.label {
	text-align: start;
	&::first-letter {
		text-transform: uppercase;
	}
}
</style>
