<template>
	<component
		:is="is"
		ref="$wrapper"
		role="checkbox"
		tabindex="0"
		:class="$style.wrapper"
		:aria-checked="checked"
		:aria-readonly="readonly"
		@keydown.space.prevent
		@keyup.space.prevent="toggle"
		@click="toggle">
		<IconSwitch
			tabindex="-1"
			:class="{ [$style.checkbox]: true }"
			class="nogrow"
			v-bind="iconSwitchProps" />
		<slot name="default"></slot>
	</component>
</template>

<script lang="ts" setup>
import type { IconSwitchState } from 'component:icon/icon-common'
import IconSwitch from 'component:icon/icon-switch.vue'
import type { ExtractPropTypes} from 'vue';
import { computed, useCssModule, ref } from 'vue'

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
		iconChecked: IconSwitchState
		iconUnchecked: IconSwitchState
		transitionName?: string
		/**
		 * Show a preview of the toggled result when hovering the checkbox?
		 * @default true
		 */
		hoverPreview?: boolean
		is: any
	}>(),
	{
		checked: false,
		transitionName: 'fade',
		hoverPreview: true,
		readonly: false,
		disabled: false,
		is: 'div'
	}
)

const $style = useCssModule()

const $emit = defineEmits<{
	/**
	 * Fires when the checkbox is activated.
	 * @param checked The new value of the checkbox. Note that this component doesn't maintain state -- so the prop isn't updated automatically.
	 */
	(event: 'input', checked: boolean): void
}>()

const iconSwitchProps = computed<ExtractPropTypes<typeof IconSwitch>>(() => {
	const icons = {
		checked: props.iconChecked,
		unchecked: props.iconUnchecked
	}
	if (!icons.checked.props) icons.checked.props = {}
	icons.checked.props.class = (icons.checked.class ?? '') + ' ' + $style.icon
	if (!icons.unchecked.props) icons.unchecked.props = {}
	icons.unchecked.props.class =
		(icons.unchecked.class ?? '') + ' ' + $style.icon
	return { icons, transitionName: props.transitionName }
})

function toggle() {
	$emit('input', !props.checked)
}

const $wrapper = ref(null)

defineExpose({
	toggle,
	checked: () => props.checked,
	element: $wrapper.value
})
</script>

<style lang="scss" module>
@use 'mixin:clickable.scss';
.icon {
	opacity: 0;
	transition: var(--ironsworn-transition);
	&[data-icon-state='unchecked'] {
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
	&:active {
		:local(.icon) {
			color: var(--ironsworn-color-warm);
		}
	}
	&[aria-checked='true'] {
		:local(.icon) {
			&[data-icon-state='checked'] {
				opacity: 1;
			}
		}
	}
	&:not([aria-readonly='true']) {
		cursor: pointer;

		&:hover {
			:local(.icon) {
				&[data-icon-state='checked'] {
					// hover while unchecked: preview checked state
					opacity: 0.5;
				}
			}
			:local(.checkbox) {
				&:not(:hover) {
					@include clickable.textHover;
				}
			}
		}
	}
	&[aria-readonly='true'] {
		// prevent hovereffects when set to readonly
		pointer-events: none;
		:local(.icon),
		:local(.icon) * {
			pointer-events: none;
		}
	}
}
</style>
