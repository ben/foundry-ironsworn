<template>
  <div
    class="movesheet-row"
    :class="{ highlighted: move?.highlighted }"
    ref="$el"
  >
    <h4 class="flexrow" :title="tooltip">
      <btn-rollmove
        :disabled="!canRoll"
        class="juicy text nogrow"
        :move="move"
      />
      <span class="clickable text" @click="data.expanded = !data.expanded">
        {{ move?.displayName }}
      </span>
    </h4>
    <transition name="slide">
      <with-rolllisteners
        element="div"
        class="move-summary"
        v-if="data.expanded"
        @moveclick="moveclick"
      >
        <div class="move-summary-buttons flexrow">
          <btn-rollmove class="block" v-if="canRoll" :move="move">
            {{ $t('IRONSWORN.Roll') }}
          </btn-rollmove>
          <btn-sendmovetochat class="block" :move="move">
            {{ $t('IRONSWORN.Chat') }}
          </btn-sendmovetochat>
        </div>
        <div v-html="$enrichMarkdown(fulltext)" />
      </with-rolllisteners>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.move-roll {
  // &[aria-disabled='true'],
  // &:disabled {
  //   visibility: hidden;
  // }
}
.move-summary {
  border-left: 2px solid;
  margin-left: 5px;
  padding-left: 1rem;
  button.icon-button {
    border: 1px solid;
  }
}
h4 {
  margin: 0;
  line-height: 1.4em;
  gap: 0.25rem;
}
.move-summary-buttons {
  gap: 0.5rem;
}
.item-row {
  transition: all 0.4s ease;
}

.slide-enter-active,
.slide-leave-active {
  max-height: 1000px;
}
</style>

<script setup lang="ts">
import { computed, defineComponent, nextTick, reactive, ref, watch } from 'vue'
import { Move } from '../../features/custommoves'
import { SFRollMoveDialog } from '../../helpers/rolldialog-sf'
import BtnRollmove from './buttons/btn-rollmove.vue'
import BtnSendmovetochat from './buttons/btn-sendmovetochat.vue'
import WithRolllisteners from './with-rolllisteners.vue'

const props = defineProps<{ move: Move }>()
const data = reactive({ expanded: false })

const tooltip = computed(() => {
  const { Title, Page } = props.move.dataforgedMove?.Source ?? {}
  if (!Title) return undefined
  return `${Title} p${Page}`
})
const fulltext = computed(() => {
  return props.move.moveItem?.data?.data?.Text
})
const canRoll = computed(() => {
  return SFRollMoveDialog.moveHasRollableOptions(props.move.moveItem)
})

const $el = ref<HTMLElement>()
const highlighted = computed(() => props.move.highlighted)
watch(highlighted, async (value?: boolean) => {
  if (value) {
    data.expanded = true
    await nextTick()
    $el.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
})

const $emit = defineEmits(['moveclick'])
function moveclick(item) {
  $emit('moveclick', item)
}

defineExpose({
  collapse: () => (data.expanded = false),
})
</script>
