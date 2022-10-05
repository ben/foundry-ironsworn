<template>
  <div
    class="box flexrow ironsworn__denizen__drop ironsworn__drop__target"
    data-drop-type="progress"
    style="padding: 3px"
    :data-idx="idx"
  >
    <label
      class="nogrow"
      style="white-space: nowrap; flex-basis: 4em; line-height: 26px"
    >
      <span v-if="denizen.low === denizen.high">{{ denizen.low }}</span>
      <span v-else>{{ denizen.low }}–{{ denizen.high }}</span>
    </label>

    <input
      v-if="editMode"
      ref="description"
      type="text"
      :class="{ highlight: data.focused }"
      :value="denizen.description"
      @input="input"
      :placeholder="denizen.descriptor"
    />
    <div
      v-else
      style="line-height: 26px"
      v-html="$enrichHtml(denizen.description)"
    />
  </div>
</template>

<style lang="less" scoped>
input {
  transition: 0.4s ease-out;
}
</style>

<script setup lang="ts">
import { reactive, Ref } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
import { computed, ref } from 'vue'
import { SiteDataProperties } from '../../../actor/actortypes'
import { $ActorKey, ActorKey } from '../../provisions'

const props = defineProps<{ idx: number }>()
const data = reactive({ focused: false })

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const editMode = computed(() => {
  return actor.value?.flags['foundry-ironsworn']?.['edit-mode']
})

const denizen = computed(() => {
  return actor.value?.data.denizens[props.idx]
})

function input(ev) {
  const val = ev.currentTarget.value || ''
  const data = $actor?.data as SiteDataProperties | undefined
  if (!data) return
  const denizens = Object.values(data.data.denizens)
  denizens[props.idx].description = val
  $actor?.update({ data: { denizens } })
}

const description = ref<HTMLElement>()
function focus() {
  data.focused = true
  description.value?.focus()
  setTimeout(() => (data.focused = false), 5000)
}
defineExpose({ focus })
</script>
