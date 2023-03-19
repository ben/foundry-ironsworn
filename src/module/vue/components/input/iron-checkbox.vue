<template>
	<component
		:is="is"
		ref="$wrapper"
		role="checkbox"
		tabindex="0"
		:class="{ [$style.wrapper]: true, [$style.hoverFxAll]: contentHoverFx }"
		:aria-checked="checked"
		:aria-readonly="readonly"
		:aria-disabled="disabled"
		@keydown.space.prevent
		@keyup.space.prevent="toggle"
		@keyup.enter.prevent="toggle"
		@click="toggle">
		<slot name="switch">
			<IconSwitch
				ref="$switch"
				tabindex="-1"
				role="presentational"
				:transition="transition"
				:states="['checked', 'unchecked']"
				:current="checked ? 'checked' : 'unchecked'"
				:class="{
					[$style.checkbox]: true,
					[iconSwitchClass]: true,
					[$style.hoverFxCheckboxOnly]: !contentHoverFx
				}"
				class="nogrow">
				<template #checked="scope">
					<slot name="checked" v-bind="{ ...scope, role: 'presentational' }" />
				</template>
				<template #unchecked="scope">
					<slot
						name="unchecked"
						v-bind="{ ...scope, role: 'presentational' }" />
				</template>
			</IconSwitch>
		</slot>
		<slot name="default"></slot>
	</component>
</template>

<script lang="ts" setup>
import IconSwitch from 'component:icon/icon-switch.vue'
import { ref, useCssModule } from 'vue'

/**
 * An accessible icon-based checkbox.
 *
 * @remarks Adapted from {@link https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/examples/checkbox/}
 */
const props = withDefaults(
	defineProps<{
		checked?: boolean
		// TODO
		readonly?: boolean
		disabled?: boolean
		/**
		 * @default 'div'
		 */
		is?: any
		iconSwitchClass?: string
		/**
		 * Does the slot content receive the same hover effect as the checkbox?
		 * @default true
		 */
		contentHoverFx?: boolean
		transition?: string
	}>(),
	{
		checked: false,
		readonly: false,
		disabled: false,
		is: 'div',
		iconSwitchClass: '',
		contentHoverFx: true,
		transition: 'fade'
	}
)

const $switch = ref<InstanceType<typeof IconSwitch>>(null)

const $style = useCssModule()

const $emit = defineEmits<{
	/**
	 * Fires when the checkbox is activated.
	 * @param checked The new value of the checkbox. Note that this component doesn't maintain state -- so the prop isn't updated automatically.
	 */
	(name: 'input', checked: boolean): void
	/**
	 * Fires when the checkbox is activated.
	 * @param checked The new value of the checkbox. Note that this component doesn't maintain state -- so the prop isn't updated automatically.
	 */
	(name: 'change', checked: boolean): void
}>()

function toggle() {
	if (props.readonly) return
	$emit('input', !props.checked)
	$emit('change', !props.checked)
}

defineExpose({
	toggle
})
</script>

<style lang="scss" module>
@use 'mixin:clickable.scss';

.hoverFxCheckboxOnly {
	transition: var(--ironsworn-transition);
}

:local(.wrapper) {
	&:not([aria-readonly='true']):not([aria-disabled='true']) {
		&:hover {
			:local(.hoverFxCheckboxOnly) {
				@include clickable.textHover;
			}
		}
	}
}

.hoverFxAll {
	@include clickable.text;
	&:active {
		:local(.icon) {
			color: var(--ironsworn-color-warm);
		}
		filter: drop-shadow(0 0 5px var(--ironsworn-color-cool));
	}
}
.icon {
	opacity: 0;
	display: flex;
	align-items: center;
	transition: var(--ironsworn-transition);
	&[data-switch-state='unchecked'] {
		// Usually the unchecked state is an empty frame -- so it can say opaque all the time.
		// TODO: make this configurable
		opacity: 1;
	}
}
.checkbox,
:local(.wrapper) {
	// strip transition from ancestors of icon, to prevent staggered transition behaviour on chromium
	transition-duration: 0;
}

.wrapper {
	justify-content: center;
	&:not([aria-readonly='true']):not([aria-disabled='true']) {
		cursor: pointer;
	}
	&[aria-checked='true'] {
		:local(.icon) {
			&[data-switch-state='checked'] {
				opacity: 1;
			}
		}
	}
	&[aria-readonly='true'] {
		// prevent hovereffects when set to readonly
		pointer-events: none;
		&:hover {
		}
		:local(.icon),
		:local(.icon) * {
			pointer-events: none;
		}
	}
}
.checkbox {
	// disable pointer events on the icon itself so that it doesn't double up on certain hover FX
	pointer-events: none;
}
</style>
