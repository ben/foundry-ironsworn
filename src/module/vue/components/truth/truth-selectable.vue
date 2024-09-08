<template>
	<label class="nogrow flexrow">
		<input
			:checked="selected"
			type="radio"
			class="nogrow"
			:name="radioGroup"
			@change="emitValue"
		/>
		<div class="flexcol">
			<p v-if="pageSystem.Summary">
				<strong>{{ pageSystem.Summary }}</strong>
			</p>

			<RenderedText
				element="div"
				:markdown="true"
				:content="pageSystem.Description"
			/>

			<section v-if="page.subtable">
				<label
					v-for="(entry, i) in page.subtable.results"
					:key="`subtableRow${i}`"
					class="flexrow nogrow"
				>
					<input
						ref="suboptions"
						type="radio"
						class="nogrow"
						:name="pageSystem.dsid"
						@change="subtableSelect(entry)"
					/>
					<p v-html="entry.text" />
				</label>

				<!-- TODO: custom input -->
			</section>

			<RenderedText
				class="quest"
				element="div"
				:markdown="true"
				:content="pageSystem.Quest"
			/>
		</div>
	</label>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IronswornJournalPage } from '../../../journal/journal-entry-page'
import type { TruthOptionDataPropertiesData } from '../../../journal/journal-entry-page-types'
import { OracleTableResult } from '../../../roll-table/oracle-table-result'
import RenderedText from 'component:rendered-text.vue'

const props = defineProps<{
	page: IronswornJournalPage<'truth'>
	radioGroup: string
}>()
const pageSystem = props.page.system as TruthOptionDataPropertiesData

const selected = ref(false)

const suboption = ref<string | undefined>()
function subtableSelect(entry: OracleTableResult) {
	suboption.value = entry.text
	selected.value = true
	emitValue()
}

const $emit = defineEmits<{
	change: [string, string] // title, text
}>()
function emitValue() {
	let text = `${pageSystem.Description} ${suboption ?? ''}\n\n_${
		pageSystem.Quest
	}_`

	const template = pageSystem['Roll template']
	if (suboption.value && template?.Description) {
		text =
			template.Description.replace(/{{table>.*?}}/, `> ${suboption.value}`) +
			`\n\n_${pageSystem.Quest}_`
	}
	$emit('change', props.page.name ?? '???', text.trim())
}

const suboptions = ref<HTMLElement[]>([])

async function selectAndRandomize() {
	selected.value = true

	if (
		props.page.subtable &&
		((props.page.subtable?.results as any)?.size ?? 0) > 0
	) {
		const { roll } = await props.page.subtable.draw()

		if (!roll || !roll.total) return

		const selectedIndex = props.page.subtable.results.contents.findIndex(
			(row) => row.hasInRange(roll.total as number)
		)
		suboptions.value[selectedIndex]?.click()
	}

	emitValue()
}

defineExpose({ selectAndRandomize })
</script>

<style lang="scss" scoped>
input[type='radio'] {
	flex-grow: 0;
	align-self: flex-start;
	margin: var(--ironsworn-spacer-lg);
}

.quest {
	font-style: italic;
}
</style>
