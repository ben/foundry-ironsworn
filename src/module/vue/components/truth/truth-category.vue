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
			:radio-group="df.$id"
			@change="valueChange" />

		<CustomTruth
			ref="customTruth"
			:radio-group="df.$id"
			@change="customValueChange" />

		<div
			v-for="(page, i) in nonTruthPages"
			:key="`nonTruthPage${i}`"
			class="nogrow"
			v-html="page.text.content" />
	</div>
</template>

<script lang="ts" setup>
import type { ISettingTruth, ISettingTruthOption } from 'dataforged'
import { computed, reactive, ref } from 'vue'
import type { IronswornJournalPage } from '../../../journal/journal-entry-page'
import type { TruthOptionDataProperties } from '../../../journal/journal-entry-page-types'
import type { TableRow } from '../../../rolls'
import { OracleRollMessage } from '../../../rolls'
import { enrichMarkdown } from '../../vue-plugin'
import IronBtn from '../buttons/iron-btn.vue'
import CustomTruth from './custom-truth.vue'
import TruthSelectable from './truth-selectable.vue'

const props = defineProps<{
	df: ISettingTruth
	je: () => JournalEntry
}>()

const jePages = (props.je() as any | undefined)?.pages ?? []
const truthPages = jePages.filter(
	(p) => p.type === 'truth'
) as IronswornJournalPage<TruthOptionDataProperties>[]
const nonTruthPages = jePages.filter((p) => p.type !== 'truth')

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
	html += nonTruthPages.map((x) => x.text.content).join('\n\n')

	return {
		title: props.je().name,
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

const truthTable = computed(() => {
	const rows = truthPages
		.map((p) => p.system as ISettingTruthOption)
		.map(
			(sys: ISettingTruthOption): TableRow => ({
				low: sys.Floor || 0,
				high: sys.Ceiling || 100,
				text: sys.Result,
				selected: false
			})
		)
})

async function randomize() {
	// Roll it like an oracle
	const rows = truthPages
		.map((p) => p.system as ISettingTruthOption)
		.map(
			(sys: ISettingTruthOption): TableRow => ({
				low: sys.Floor || 0,
				high: sys.Ceiling || 100,
				text: sys.Result,
				selected: false
			})
		)
	const msg = OracleRollMessage.fromRows(
		rows,
		props.je().name ?? '',
		game.i18n.localize('IRONSWORN.First Start.SettingTruths')
	)
	await msg.createOrUpdate()

	// Find the result and activate it
	const result = await msg.getResult()
	const dfRow = props.df.Table.find((x) => x.Floor === result?.low)
	if (!dfRow) throw new Error('wtf')
	const idx = props.df.Table.indexOf(dfRow)
	await selectables.value[idx]?.selectAndRandomize()
}

defineExpose({ selectedValue, scrollIntoView, randomize })
</script>

<style lang="scss" scoped>
h1 {
	margin-top: 1em;
}
</style>
