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
			:radio-group="dsid"
			@change="valueChange"
		/>

		<CustomTruth
			ref="customTruth"
			:radio-group="dsid"
			@change="customValueChange"
		/>

		<RenderedText
			v-for="(page, i) in nonTruthPages"
			:key="`nonTruthPage${i}`"
			class="nogrow"
			element="div"
			:content="page.text.content"
		/>
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
import RenderedText from 'component:rendered-text.vue'

const props = defineProps<{
	je: () => IronswornJournalEntry
}>()

const model = defineModel()

type NonTruthPage = IronswornJournalPage<Exclude<JournalEntryPageType, 'truth'>>

const truthPages = props.je()?.pageTypes.truth
const nonTruthPages = props
	.je()
	?.pages.filter((p) => p.type !== 'truth') as NonTruthPage[]

const dsid = props.je().getFlag('foundry-ironsworn', 'dsid') as string

const state = reactive<{
	title?: string
	text?: string
	html?: string
	custom?: boolean
}>({})
async function valueChange(title: string, text: string) {
	state.title = title
	state.text = text
	state.html = undefined
	model.value = await selectedValue()
}
async function customValueChange(html: string) {
	state.title = undefined
	state.text = undefined
	state.html = html
	model.value = await selectedValue()
}

async function selectedValue() {
	let html = state.html
	if (!html) {
		html = `
      ${await enrichMarkdown(`**${state.title}**`)}
      ${await enrichMarkdown(state.text)}
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
