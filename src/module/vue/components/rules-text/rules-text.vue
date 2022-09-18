<template>
  <WithRolllisteners element="article" class="rules-text">
    <slot name="before-main"></slot>
    <section v-if="props.type === 'slot'" class="rules-text-main">
      <slot name="default"></slot>
    </section>
    <section v-else class="rules-text-main" v-html="enrichedText" />
    <slot name="after-main"></slot>
    <footer class="rules-text-footer" v-if="props.source">
      <RulesSourceInfo :source="props.source" />
    </footer>
    <slot name="after-footer"></slot>
  </WithRolllisteners>
</template>
<style lang="less">
.rules-text {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.rules-text-main {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
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

<script setup lang="ts">
import { computed } from 'vue'
import { IronswornHandlebarsHelpers } from '../../../helpers/handlebars.js'
import { enrichMarkdown } from '../../vue-plugin.js'
import RulesSourceInfo from './rules-source-info.vue'
import WithRolllisteners from '../with-rolllisteners.vue'
import { ISource } from 'dataforged'
import { enrichHtml } from '../../vue-plugin.js'

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
  source?: ISource
}>()

const enrichedText = computed(() => {
  if (props.type === 'markdown') {
    return IronswornHandlebarsHelpers.stripTables(
      enrichMarkdown(props.content as string)
    )
  }
  if (props.type === 'html') {
    return IronswornHandlebarsHelpers.stripTables(enrichHtml(props.content))
  }
  return ''
})
</script>
