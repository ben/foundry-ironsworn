<template>
	<IronBtn :class="{ [$style.iconSwitch]: true }" v-bind="ironBtnProps">
		<template #icon>
			<TransitionGroup :name="transitionName">
				<component
					v-for="(iconData, state) in $props.icons"
					:key="state"
					:data-icon-state="state"
					:class="`${$style.icon} ${getIconOptions(iconData).props.class}`"
					:is="
						getIconOptions(iconData).set === 'ironsworn' ? IronIcon : FontIcon
					"
					v-bind="getIconOptions(iconData).props" />
			</TransitionGroup>
		</template>
	</IronBtn>
</template>

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

<script lang="ts" setup>
import IronBtn from 'component:buttons/iron-btn.vue'
import {
	IconSwitchState,
	IronswornIconId,
	parseClassesToFaProps
} from 'component:icon/icon-common'
import IronIcon from 'component:icon/iron-icon.vue'
import FontIcon from 'component:icon/font-icon.vue'
import { omit } from 'lodash-es'
import { computed, ComputedRef, ExtractPropTypes, TransitionGroup } from 'vue'

type IronBtnProps = ExtractPropTypes<typeof IronBtn>
interface Props
	extends Omit<IronBtnProps, 'text' | 'icon' | 'vertical' | 'justify'> {
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

const props = defineProps<Props>()

const ironBtnProps: ComputedRef<IronBtnProps> = computed(() => {
	return {
		...omit(props, ['iconOn', 'iconOff', 'state', 'readonly']),
		justify: 'center'
	}
})

function getIconOptions(iconState: IconSwitchState) {
	const [set, name] = iconState.icon.split(/:/)
	let props: (typeof iconState)['icon'] extends IronswornIconId
		? ExtractPropTypes<typeof IronIcon>
		: ExtractPropTypes<typeof FontIcon> = {
		name,
		...(iconState.props ?? {})
	}

	if (set === 'fa' && iconState.class) {
		props = mergeObject(props, parseClassesToFaProps(iconState.class ?? ''))
	}

	return {
		set,
		props
	}
}
</script>
