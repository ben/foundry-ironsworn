<template>
	<label class="nogrow flexrow">
		<input
			ref="topRadio"
			type="radio"
			class="nogrow"
			:name="radioGroup"
			@change="select" />
		<div class="flexcol">
			<p>
				<strong>{{ page.name }}</strong>
			</p>

			<div v-html="$enrichMarkdown(pageSystem.Description)" />

			<section v-if="pageSystem.Subtable">
				<label
					v-for="(entry, i) in pageSystem.Subtable"
					:key="`subtableRow${i}`"
					class="flexrow nogrow">
					<input
						ref="suboptions"
						type="radio"
						class="nogrow"
						:name="pageSystem.dfid"
						@change="subtableSelect(entry as any)" />
					<p v-html="entry.Result" />
				</label>

				<!-- TODO: custom input -->
			</section>

			<div class="quest" v-html="$enrichMarkdown(pageSystem.Quest)" />
		</div>
	</label>
</template>

<script setup lang="ts">
import type {
	ISettingTruthOption,
	ISettingTruthOptionSubtableRow
} from 'dataforged'
import { inRange } from 'lodash-es'
import { reactive, ref } from 'vue'
import type { IronswornJournalPage } from '../../../journal/journal-entry-page'

const props = defineProps<{
	// @ts-ignore
	page: IronswornJournalPage
	radioGroup: string
}>()
const pageSystem = (props.page as any).system as ISettingTruthOption & {
	dfid: string
	Quest: string
}

function select() {
	emitValue()
}

const topRadio = ref<HTMLElement>()
const state = reactive({ suboption: undefined as string | undefined })
function subtableSelect(entry: ISettingTruthOptionSubtableRow) {
	state.suboption = entry.Result
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

	if (props.page.subtable) {
		// LoFD is *not* consistent with FVTT's actual source code, here.
		// when displaychat === true, denizens.draw calls RollTable#toMessage, which calls to ChatMessage#create
		const msg = (await props.page.subtable.draw({
			displayChat: true
		})) as unknown as ChatMessage
		if (!msg) return

		const roll = msg.rolls?.[0]

		if (!roll || !roll.total) return

		const selectedIndex = props.page.subtable.results.contents.findIndex(
			(row) => inRange(roll.total as number, ...row.range)
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
