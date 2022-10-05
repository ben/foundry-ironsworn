<template>
  <div class="flexcol box ironsworn__drop__target" :data-drop-type="itemType">
    <div v-if="item" style="padding: 1em; position: relative">
      <div class="flexrow">
        <document-img
          :document="item"
          size="38px"
          class="nogrow"
          style="margin-right: 5px"
        />

        <div class="flexcol">
          <h4 style="margin: 0">{{ item.name }}</h4>
          <p>{{ item.data.summary }}</p>
        </div>

        <div
          class="flexrow"
          v-if="editMode"
          style="position: absolute; right: 5px; top: 5px"
        >
          <btn-faicon class="block" icon="trash" @click="destroy" />
          <btn-faicon class="block" icon="edit" @click="edit" />
        </div>
      </div>
    </div>

    <div v-else style="padding: 1em; width: 100%">
      <div class="flexcol">
        <h4 style="margin: 0">{{ $t(titleKey) }}</h4>
        <btn-compendium
          :compendium="compendiumKey"
          style="padding: 0 2em"
          class="inset block"
          >{{ $t('IRONSWORN.OpenCompendium') }}</btn-compendium
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, Ref } from '@vue/runtime-core'
import { $ActorKey, ActorKey } from '../../provisions'
import { computed } from 'vue'
import DocumentImg from '../document-img.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'
import BtnCompendium from '../buttons/btn-compendium.vue'

const props = defineProps<{
  item: any
  itemType: string
  titleKey: string
  compendiumKey: string
}>()

const $actor = inject($ActorKey)

const actor = inject(ActorKey) as Ref
const editMode = computed(() => {
  return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})

function foundryitem() {
  return props.item && $actor?.items.get(props.item._id)
}

function destroy() {
  const titleKey = 'IRONSWORN.DeleteItem'

  Dialog.confirm({
    title: game.i18n.localize(titleKey),
    content: `<p><strong>${game.i18n.localize(
      'IRONSWORN.ConfirmDelete'
    )}</strong></p>`,
    yes: () => foundryitem()?.delete(),
    defaultYes: false,
  })
}

function edit() {
  foundryitem()?.sheet?.render(true)
}
</script>
