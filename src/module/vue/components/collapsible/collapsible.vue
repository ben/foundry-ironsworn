<template>
	<component
		:is="wrapperIs"
		:id="wrapperId"
		ref="$element"
		:class="$style.wrapper"
		:aria-expanded="state.expanded"
		:tabindex="-1"
		:aria-orientation="orientation"
		:aria-disabled="disabled"
	>
		<component
			:is="toggleSectionIs"
			:class="[toggleSectionClass, $style.toggleSection]"
		>
			<slot name="before-toggle"></slot>
			<component
				:is="toggleWrapperIs"
				:class="[toggleWrapperClass, $style.toggleWrapper, 'toggle-wrapper']"
			>
				<IronBtn
					:id="controlId"
					ref="$toggle"
					:aria-controls="contentId"
					:disabled="disabled"
					:class="[$style.toggle, toggleButtonClass]"
					:tooltip="toggleTooltip"
					data-tooltip-direction="LEFT"
					:text="toggleLabel"
					@click="toggle()"
				>
					<template #icon>
						<slot name="toggleIcon">
							<FontIcon
								v-if="icon"
								:name="icon"
								:class="$style.toggleBtn"
								:size="FontAwesome.Size['xs']"
							/>
						</slot>
					</template>
				</IronBtn>
			</component>
			<slot name="after-toggle"></slot>
		</component>
		<CollapseTransition
			ref="$collapseTransition"
			:v-bind="props.collapseTransition"
			:duration="currentDuration"
			:orientation="dimension"
			@before-enter="
				$emit('before-expand', $event, $collapseTransition, $element)
			"
			@after-enter="
				$emit('after-expand', $event, $collapseTransition, $element)
			"
			@before-leave="
				$emit('before-collapse', $event, $collapseTransition, $element)
			"
			@after-leave="
				$emit('after-collapse', $event, $collapseTransition, $element)
			"
		>
			<Suspense v-if="state.expanded">
				<component
					:is="contentWrapperIs"
					:id="contentId"
					ref="$contentWrapper"
					role="region"
					:aria-labelledby="controlId"
					:class="[contentWrapperClass, $style.content]"
				>
					<slot name="default"></slot>
				</component>
			</Suspense>
		</CollapseTransition>
	</component>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import CollapseTransition from '../transition/collapse-transition.vue'
import { computed, ref } from 'vue'
import type { ExpandEvent, CollapseEvent } from './collapsible-helpers'
import IronBtn from '../buttons/iron-btn.vue'
import { FontAwesome } from '../icon/icon-common'
import type { Property } from 'csstype'
import FontIcon from '../icon/font-icon.vue'

const props = withDefaults(
	defineProps<{
		duration?: PropsOf<typeof CollapseTransition>['duration']
		/**
		 * The text displayed on the button element that controls the expand/collapse toggle.
		 */
		toggleLabel: string
		/**
		 * The ID to be assigned to the wrapper element, from which the IDs of other elements within this component are generated. Required in order to generate the correct ARIA annotations.
		 */
		baseId: string
		/**
		 * @defaultValue `'vertical'`
		 */
		orientation?: 'horizontal' | 'vertical'
		icon?: FontAwesome.Name | null

		toggleTooltip?: string
		disabled?: boolean
		/**
		 * @defaultValue `'article'`
		 */
		wrapperIs?: string
		/**
		 * @defaultValue `'header'`
		 */
		toggleSectionIs?: string
		toggleSectionClass?: any
		/**
		 * @defaultValue `'h3'`
		 */
		toggleWrapperIs?: string
		toggleWrapperClass?: any
		toggleButtonClass?: any
		toggleTextClass?: any
		/**
		 * @defaultValue `'section'`
		 */
		contentWrapperIs?: string
		contentWrapperClass?: any
		/**
		 * @default false
		 */
		expanded?: boolean
		/**
		 * Props for the {@link CollapseTransition}.
		 * @inheritdoc
		 */
		collapseTransition?: Omit<
			PropsOf<typeof CollapseTransition>,
			'dimension' | 'duration'
		>
		/**
		 * Prevents transition from animating.
		 */
		disableTransition?: boolean
		disableToggleAnimation?: boolean
	}>(),
	{
		wrapperIs: 'article',
		contentWrapperIs: 'section',
		toggleWrapperIs: 'h3',
		toggleSectionIs: 'header',
		disabled: false,
		contentWrapperClass: '',
		toggleWrapperClass: '',
		headingClass: '',
		expanded: false,
		duration: 300,
		disableTransition: false,
		icon: 'chevron-right',
		disableToggleAnimation: false
	}
)

let $element = ref<HTMLElement>()
let $toggle = ref<HTMLElement>()
let $collapseTransition = ref<typeof CollapseTransition>()
let $contentWrapper = ref<HTMLElement>()

const state = reactive<{
	expanded: boolean
	duration: number
}>({
	expanded: props.expanded,
	duration: props.duration
})

const wrapperId = computed(() => props.baseId)
const controlId = computed(() => `${props.baseId}_control`)
const contentId = computed(() => `${props.baseId}_content`)

const dimension = computed(() =>
	props.orientation === 'horizontal' ? 'width' : 'height'
)

const currentDuration = computed(() =>
	props.disableTransition === true ? 0 : state.duration
)

const $emit = defineEmits<{
	'before-expand': [ExpandEvent]
	'after-expand': [ExpandEvent]
	'before-collapse': [CollapseEvent]
	'after-collapse': [CollapseEvent]
}>()

function toggle() {
	state.expanded = !state.expanded
}

function expand() {
	state.expanded = true
}

function collapse() {
	state.expanded = false
}

const transform = computed<Property.Transform>(() => {
	if (props.disableToggleAnimation || !props.icon) {
		return 'none'
	}
	return 'rotate(90deg)'
})

defineExpose({
	$element,
	$collapseTransition,
	toggle,
	collapse,
	expand,
	/**
	 * Whether the collapsible is expanded.
	 */
	get isExpanded() {
		return state.expanded
	},
	/**
	 * The current duration of the animation, in ms.
	 */
	get duration() {
		return state.duration
	}
})
</script>

<style lang="scss" module>
.wrapper {
	// TODO: horizontal and vertical versions
}

.content {
	// TODO: horizontal and vertical versions
}

.toggleBtn {
	display: flex;
	transition: transform 0.4s;
	margin-left: var(--ironsworn-spacer-xs);

	.wrapper[aria-expanded='true'] & {
		transform: v-bind(transform);
	}
}

.toggleWrapper {
	display: flex;
	flex-grow: 1;
	margin: 0;
	padding: 0;
}

.toggleSection {
	display: flex;
}

.toggle {
	flex-grow: 1;
	justify-content: left;
	margin: 0;
	height: inherit;
	text-transform: uppercase;
	font-size: inherit;
}
</style>
