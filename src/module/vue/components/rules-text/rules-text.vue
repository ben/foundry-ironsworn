<template>
	<WithRolllisteners element="article" class="rules-text">
		<slot name="before-main"></slot>
		<section v-if="props.type === 'slot'" class="rules-text-main">
			<slot name="default"></slot>
		</section>
		<section v-else class="rules-text-main" v-html="content" />
		<slot name="after-main"></slot>
		<footer v-if="props.source" class="rules-text-footer">
			<RulesSourceInfo :source="props.source" />
		</footer>
		<slot name="after-footer"></slot>
	</WithRolllisteners>
</template>
<script setup lang="ts">
import { IronswornHandlebarsHelpers } from '../../../helpers/handlebars.js'
import { enrichMarkdown, enrichHtml } from '../../vue-plugin.js'
import RulesSourceInfo from './rules-source-info.vue'
import WithRolllisteners from '../with-rolllisteners.vue'
import type { SourceInfo } from '@datasworn/core/dist/Datasworn'

const props = defineProps<{
	/**
	 * The type of text content to be displayed:
	 * `slot`: uses the content of the 'default' slot
	 * `markdown`: the `content` prop, and passes it through {@link enrichMarkdown}
	 * `html`: the `content` prop, and passes it through {@link enrichHtml}
	 */
	type: 'slot' | 'markdown' | 'html'
	/**
	 * Markdown or HTML content, used when `type` is set to `markdown` or `html`
	 */
	content?: string
	/**
	 * Dataforged source data to be included in the footer.
	 */
	source?: SourceInfo
	/**
	 * Whether or not to strip tables from the display. Many times they are redundant,
	 * but sometimes they are essential.
	 */
	stripTables?: boolean
}>()
let content = props.content
if (props.type === 'markdown') {
	content = await enrichMarkdown(content)
} else {
	content = await enrichHtml(content)
}
if (props.stripTables) {
	content = IronswornHandlebarsHelpers.stripTables(content)
}
</script>

<style lang="scss">
@use 'mixin:text.scss';

.rules-text {
	--ironsworn-rules-text-spacer: 0.5em;

	display: flex;
	flex-direction: column;
	gap: var(--ironsworn-rules-text-spacer);
}

.rules-text-main {
	@include text.compact;

	flex-direction: column;
	gap: var(--ironsworn-rules-text-spacer);
	&:first-of-type {
		margin-top: 0;
	}

	&:last-of-type:not(:last-child) {
		margin-bottom: 0;
	}

	& > * {
		margin: 0;
	}
}

.rules-text-footer {
	text-align: right;
}

.rules-source-info {
	opacity: 0.5;
	font-size: small;
}
</style>
