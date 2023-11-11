<template>
	<label class="nogrow flexrow">
		<input
			ref="topRadio"
			type="radio"
			class="nogrow"
			:name="radioGroup"
			@change="emitValue"
		/>
		<div class="flexcol">
			<p>
				<strong>{{ page.name }}</strong>
			</p>

			<div v-html="$enrichMarkdown(pageSystem.Description)" />

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
						:name="pageSystem.dfid"
						@change="subtableSelect(entry)"
					/>
					<p v-html="entry.text" />
				</label>

				<!-- TODO: custom input -->
			</section>

			<div class="quest" v-html="$enrichMarkdown(pageSystem.Quest)" />
		</div>
	</label>
</template>

<script setup lang="ts">
import type { ISettingTruthOptionSubtableRow } from 'dataforged'
import { reactive, ref } from 'vue'
import type { IronswornJournalPage } from '../../../journal/journal-entry-page'
import type { TruthOptionDataPropertiesData } from '../../../journal/journal-entry-page-types'
import { OracleTableResult } from '../../../roll-table/oracle-table-result'

const props = defineProps<{
	page: IronswornJournalPage<'truth'>
	radioGroup: string
}>()
const pageSystem = props.page.system as TruthOptionDataPropertiesData

const topRadio = ref<HTMLElement>()
const state = reactive({ suboption: undefined as string | undefined })
function subtableSelect(entry: OracleTableResult) {
	state.suboption = entry.text
	topRadio.value?.click()
	emitValue()
}

const $emit = defineEmits<{
	(e: 'change', title: string, text: string)
}>()
function emitValue() {
	let text = `${pageSystem.Description} ${state.suboption ?? ''}\n\n_${
		pageSystem.Quest
	}_`
	const template = pageSystem['Roll template']
	if (state.suboption && template?.Description) {
		text =
			template.Description.replace(/\${{.*?}}/, state.suboption) +
			`\n\n_${pageSystem.Quest}_`
	}
	$emit('change', props.page.name ?? '???', text.trim())
}

const suboptions = ref<HTMLElement[]>([])

async function selectAndRandomize() {
	topRadio.value?.click()

	if (
		props.page.subtable &&
		((props.page.subtable?.results as any)?.length ?? 0) > 0
	) {
		const { roll } = await props.page.subtable.draw()

		if (!roll || !roll.total) return

		const selectedIndex = props.page.subtable.results.contents.findIndex(
			(row) => row.hasInRange(roll.total as number)
		)
		suboptions.value[selectedIndex]?.click()
	}
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
