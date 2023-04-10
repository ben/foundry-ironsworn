<template>
	<div ref="root" class="flexcol">
		<h1 class="flexrow">
			<span>{{ je().name }}</span>
			<IronBtn nogrow icon="ironsworn:d10-tilt" @click="randomize" />
		</h1>

		<TruthSelectable
			v-for="(page, i) in truthPages"
			:key="`truthPage${i}`"
			ref="selectables"
			:page="page"
			:radio-group="dfid"
			@change="valueChange" />

		<CustomTruth
			ref="customTruth"
			:radio-group="dfid"
			@change="customValueChange" />

		<div
			v-for="(page, i) in nonTruthPages"
			:key="`nonTruthPage${i}`"
			class="nogrow"
			v-html="page.text.content" />
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { IronswornJournalEntry } from '../../../journal/journal-entry'
import type { IronswornJournalPage } from '../../../journal/journal-entry-page'
import { enrichMarkdown } from '../../vue-plugin'
import IronBtn from '../buttons/iron-btn.vue'
import CustomTruth from './custom-truth.vue'
import TruthSelectable from './truth-selectable.vue'

const props = defineProps<{
	je: () => IronswornJournalEntry
}>()

type NonTruthPage = IronswornJournalPage<Exclude<JournalEntryPageType, 'truth'>>

const truthPages = props.je()?.pageTypes.truth
const nonTruthPages = props
	.je()
	?.pages.filter((p) => p.type !== 'truth') as NonTruthPage[]

const dfid = props.je().getFlag('foundry-ironsworn', 'dfid') as string

const state = reactive<{
	title?: string
	text?: string
	html?: string
}>({})
function valueChange(title: string, text: string) {
	state.title = title
	state.text = text
	state.html = undefined
}
function customValueChange(html: string) {
	state.title = undefined
	state.text = undefined
	state.html = html
}

function selectedValue() {
	let html = state.html
	if (!html) {
		html = `
      ${enrichMarkdown(`**${state.title}**`)}
      ${enrichMarkdown(state.text)}
    `
	}
	html += nonTruthPages?.map((x) => x.text.content).join('\n\n')

	return {
		title: props.je()?.name,
		html: html.trim(),
		valid: !!(state.title || state.html)
	}
}

const root = ref<HTMLElement>()
function scrollIntoView() {
	root.value?.scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	})
}

const selectables = ref<(typeof TruthSelectable)[]>([])
const customTruth = ref<typeof CustomTruth>()

async function randomize() {
	// Roll it like an oracle

	const tbl = props.je().truthTable
	if (!tbl) return

	const { roll } = await tbl.draw()

	if (!roll || !roll.total) return

	// Find the result and activate it

	const selectedIndex = tbl.results.contents.findIndex((row) =>
		row.hasInRange(roll.total as number)
	)
	await selectables.value[selectedIndex]?.selectAndRandomize()
}

defineExpose({ selectedValue, scrollIntoView, randomize })
</script>

<style lang="scss" scoped>
h1 {
	margin-top: 1em;
}
</style>
