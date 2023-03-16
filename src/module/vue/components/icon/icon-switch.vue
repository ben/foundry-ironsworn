<template>
	<component :is="is" :class="{ [$style.iconSwitch]: true }">
		<TransitionGroup :name="transitionName">
			<component
				:is="getIconOptions(iconData).set === 'ironsworn' ? IronIcon : FontIcon"
				v-for="(iconData, state) in $props.icons"
				:key="state"
				:data-icon-state="state"
				:class="`${$style.icon} ${getIconOptions(iconData).props?.class}`"
				v-bind="getIconOptions(iconData).props" />
		</TransitionGroup>
	</component>
</template>

<script lang="ts" setup>
import IronIcon from 'component:icon/iron-icon.vue'
import FontIcon from 'component:icon/font-icon.vue'
import { omit } from 'lodash-es'
import type { ComputedRef, ExtractPropTypes } from 'vue'
import { computed, TransitionGroup } from 'vue'
import type {
	FontAwesomeIconProps,
	IconSwitchState,
	IronIconProps,
	IronswornIconId
} from './icon-common'
import { parseClassesToFaProps } from './icon-common'
import type IronBtn from '../buttons/iron-btn.vue'

type IronBtnProps = ExtractPropTypes<typeof IronBtn>
interface Props
	extends Omit<IronBtnProps, 'text' | 'icon' | 'vertical' | 'justify'> {
	/**
	 * @default 'span'
	 */
	is?: any
	/**
	 * Describes the current state of all icons in this component.
	 *
	 * @example
	 * ```
	 * {
	 *   on: {
	 *     icon: 'fa:some-icon'
	 *   },
	 *   off: {
	 *     icon: 'fa:some-other-icon'
	 *     props: { hidden: true }
	 *   }
	 * }
	 * ```
	 */
	icons: Record<string, IconSwitchState>
	/**
	 * @default 'fade'
	 */
	transitionName?: string
}

const props = withDefaults(defineProps<Props>(), {
	transitionName: 'fade',
	is: 'span'
})

const ironBtnProps: ComputedRef<IronBtnProps> = computed(() => {
	return {
		...omit(props, ['iconOn', 'iconOff', 'state', 'readonly']),
		justify: 'center'
	}
})

function getIconOptions(iconState: IconSwitchState) {
	const [set, name] = iconState.icon.split(/:/)
	let props: ((typeof iconState)['icon'] extends IronswornIconId
		? IronIconProps
		: FontAwesomeIconProps) & { class?: string[] } = {
		name: name as any,
		...(iconState.props ?? {})
	}

	if (set === 'fa' && iconState.class) {
		props = foundry.utils.mergeObject(
			props,
			parseClassesToFaProps(iconState.class ?? '') as any
		)
	}

	return {
		set,
		props
	}
}
</script>

<style lang="scss" module>
.iconSwitch {
	// use grid to position stacked icons, which is more flexible than absolute positioning
	display: grid;
}

.icon {
	// stacks icons on top of each other by assigning them to the same grid cell
	grid-row: 1;
	grid-column: 1;
}
</style>
