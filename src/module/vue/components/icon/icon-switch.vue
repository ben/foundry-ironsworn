<template>
	<component :is="is" :class="{ [$style.wrapper]: true }">
		<TransitionGroup :name="transitionName">
			<template v-for="iconState in states" :key="iconState">
				<template v-if="iconState === current">
					<slot
						:name="iconState"
						v-bind="{
							'data-switch-state': iconState,
							class: $style.icon
						}"></slot>
				</template>
			</template>
		</TransitionGroup>
	</component>
</template>

<script lang="ts" setup>
import type IronBtn from '../buttons/iron-btn.vue'
import { TransitionGroup } from 'vue'

interface Props
	extends /* @vue-ignore */ Omit<
		PropsOf<typeof IronBtn>,
		'text' | 'icon' | 'vertical' | 'justify'
	> {
	/**
	 * A list of unique names for the switch's states.
	 */
	states: Iterable<string>
	/**
	 * The currently active state.
	 */
	current: this['states'] extends Iterable<infer U> ? U : never
	/**
	 * @default 'fade'
	 */
	transitionName?: string
	/**
	 * @default 'span'
	 */
	is?: any
}

withDefaults(defineProps<Props>(), {
	transitionName: 'fade',
	is: 'span'
})
</script>

<style lang="scss" module>
.wrapper {
	// use grid to position stacked icons, which is more flexible than absolute positioning
	display: grid;
	width: var(--ironsworn-icon-size);
	height: var(--ironsworn-icon-size);
}

.icon {
	// stacks icons on top of each other by assigning them to the same grid cell
	grid-row: 1;
	grid-column: 1;
	width: inherit;
	height: inherit;
}
</style>
