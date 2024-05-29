<template>
	<article
		:class="$style.wrapper"
		:aria-label="$t('IRONSWORN.ChallengeRank')"
		:aria-valuetext="ChallengeRank.localizeValue(current)"
		:aria-valuemin="ChallengeRank.MIN"
		:aria-valuemax="ChallengeRank.MAX"
		:aria-valuenow="current"
		aria-orientation="horizontal"
		tabindex="0"
		:aria-readonly="readonly"
		role="spinbutton"
		@keydown.arrow-up="setRank(current + 1)"
		@keydown.+="setRank(current + 1)"
		@keydown.arrow-left="setRank(current + 1)"
		@keydown.page-up="setRank(current + 2)"
		@keydown.-="setRank(current - 1)"
		@keydown.arrow-down="setRank(current - 1)"
		@keydown.arrow-right="setRank(current - 1)"
		@keydown.page-down="setRank(current - 2)"
		@keydown.home="setRank(ChallengeRank.MIN)"
		@keydown.end="setRank(ChallengeRank.MAX)"
		@keydown.1="setRank(1)"
		@keydown.2="setRank(2)"
		@keydown.3="setRank(3)"
		@keydown.4="setRank(4)"
		@keydown.5="setRank(5)"
	>
		<button
			v-for="rank in ChallengeRank.RANK"
			:key="rank"
			:data-tooltip="ChallengeRank.localizeValue(rank)"
			data-tooltip-direction="UP"
			type="button"
			class="nogrow"
			tabindex="-1"
			:aria-selected="rank === current"
			:data-pip-state="getState(rank)"
			:class="$style.pip"
			@focus.prevent
			@mouseover="hovered = rank"
			@mouseleave="hovered = 0"
			@click="setRank(rank)"
		>
			<FontIcon
				v-bind="IronswornSettings.deco.challengeRank.checked"
				role="presentational"
				:fw="false"
				:class="[$style.checked, $style.icon]"
			/>
			<FontIcon
				v-bind="IronswornSettings.deco.challengeRank.unchecked"
				role="presentational"
				:fw="false"
				:class="[$style.unchecked, $style.icon]"
			/>
		</button>
	</article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IronswornSettings } from '../../../helpers/settings.js'
import FontIcon from '../icon/font-icon.vue'
import { ChallengeRank } from '../../../fields/ChallengeRank'

const props = withDefaults(
	defineProps<{
		current: ChallengeRank.Value
		readonly?: boolean
	}>(),
	{ readonly: false }
)

const hovered = ref(0)

const pipPadding = computed(() => IronswornSettings.deco.challengeRank.padding)

type PipState = 'filled' | 'empty' | 'preview'

function getState(rank: ChallengeRank.Value): PipState {
	switch (true) {
		case hovered.value === 0 && rank <= props.current:
			return 'filled'
		case rank <= hovered.value:
			return 'preview'
		default:
			return 'empty'
	}
}

const $emit = defineEmits<{
	change: [ChallengeRank.Value]
}>()

function setRank(rank: number) {
	if (props.readonly) return
	$emit(
		'change',
		Math.clamped(
			rank,
			ChallengeRank.MIN,
			ChallengeRank.MAX
		) as ChallengeRank.Value
	)
}
</script>
<style lang="scss" module>
.wrapper {
	--fa-display: block;

	display: flex;
	flex-grow: 0;
	align-items: center;
	width: max-content;
	height: max-content;
	&[aria-readonly='true'] {
		pointer-events: none !important;
	}
}

.pip {
	display: grid;
	box-shadow: none !important;
	background: none;
	// use padding isntead of margins for one continuous surface -- avoids hover flicker
	padding: v-bind(pipPadding);
	width: max-content;
	height: max-content;
	color: currentColor;
}

.icon {
	// display: block !important;
	// stacks icons on top of each other by assigning them to the same grid cell
	grid-row: 1;
	grid-column: 1;
	transition: opacity var(--ironsworn-transition-timing);
}

.checked {
	opacity: 0;
}
.unchecked {
}

[data-pip-state='filled'] {
	:local(.checked) {
		opacity: 1;
	}
}

[data-pip-state='preview'] {
	&:active {
		:local(.checked) {
			opacity: 1;
		}
	}
	:local(.checked) {
		opacity: 0.5;
	}
}
</style>
