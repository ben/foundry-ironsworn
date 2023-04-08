<template>
	<div class="flexrow" style="position: relative">
		<nav class="flexcol">
			<IronBtn
				v-for="(truth, i) in data.truths"
				:key="i"
				nogrow
				:text="truth.je().name ?? '???'"
				@click="scrollToCategory(i)" />

			<hr class="nogrow" />
			<IronBtn
				nogrow
				icon="ironsworn:d10-tilt"
				:text="$t('IRONSWORN.RandomizeAll')"
				@click="randomizeAll" />
			<IronBtn
				nogrow
				:text="$t('IRONSWORN.SaveYourTruths')"
				icon="fa:feather"
				@click="saveTruths" />
		</nav>
		<section class="flexcol">
			<aside class="flexrow nowrap">
				<i class="fa-regular fa-circle-info nogrow"></i>
				<p>{{ $t('IRONSWORN.TruthsAreOptional') }}</p>
			</aside>
			<TruthCategory
				v-for="truth in data.truths"
				ref="categoryComponents"
				:key="(truth.je()._id as string)"
				:je="truth.je" />
		</section>
	</div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import type { ISettingTruth } from 'dataforged'
import { $LocalEmitterKey } from './provisions'
import IronBtn from './components/buttons/iron-btn.vue'
import TruthCategory from './components/truth/truth-category.vue'
import { IronswornJournalEntry } from '../journal/journal-entry'

const props = defineProps<{
	data: {
		truths: {
			df: ISettingTruth
			je: () => IronswornJournalEntry
		}[]
	}
}>()

const categoryComponents = ref<(typeof TruthCategory)[]>([])

function scrollToCategory(i: number) {
	categoryComponents.value[i]?.scrollIntoView()
}

const $localEmitter = inject($LocalEmitterKey)
async function saveTruths() {
	// Fetch values from the category components
	const values = categoryComponents.value
		.map((x) => x.selectedValue())
		.filter((x) => x.valid)

	const content = values
		.map(
			({ title, html }) => `
        <h2>${title}</h2>
        ${html}
      `
		)
		.join('\n\n')

	const journal = await IronswornJournalEntry.create({
		name: game.i18n.localize('IRONSWORN.JOURNALENTRYPAGES.TypeTruth'),
		content
	})
	journal?.sheet?.render(true)
	$localEmitter?.emit('closeApp')
}

async function randomizeAll() {
	for (const cat of categoryComponents.value) {
		await cat.randomize()
	}
}
</script>

<style lang="scss" scoped>
nav {
	position: fixed;
	margin-top: 1em;
	height: 100%;
}

section {
	margin-left: 15em;
}

aside {
	gap: var(--ironsworn-spacer-md);
	border: var(--ironsworn-border-width-md) solid var(--ironsworn-color-cool-70);
	border-radius: var(--ironsworn-border-radius-md);
	padding: 0.75em;

	p {
		margin: 0;
	}

	i {
		margin-top: 0.1em;
	}
}
</style>
