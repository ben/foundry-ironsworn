<template>
  <div class="foe-sheet flexcol">
    <SheetHeaderBasic :document="progressItemData ?? actor" class="nogrow" />
    <div v-if="progressItemData">
      <ProgressEmbed :item="progressItemData" />
      <hr class="nogrow" />
      <MceEditor
        v-model="progressItemData.data.description"
        @save="saveDescription"
        @change="throttledSaveDescription"
      />
      <!-- <div v-html="foe.data.description" /> -->
    </div>

    <div
      v-else
      class="flexcol ironsworn__drop__target"
      data-drop-type="progress"
      style="text-align: center; justify-items: space-around"
    >
      <BtnFaicon @click="addEmpty" class="block" icon="file">
        {{ $t('IRONSWORN.Progress') }}</BtnFaicon
      >
      <BtnCompendium class="block" compendium="ironswornfoes"
        >{{ $t('IRONSWORN.Foes') }} (Ironsworn)</BtnCompendium
      >
      <BtnCompendium class="block" compendium="starforgedencounters"
        >{{ $t('IRONSWORN.Foes') }} (Starforged)</BtnCompendium
      >
    </div>
  </div>
</template>

<style lang="less" scoped>
.ironsworn__drop__target .clickable.block {
  padding: 1rem;
  flex-grow: 0;
}
</style>

<script setup lang="ts">
import SheetHeaderBasic from '../sheet-header-basic.vue'
import { computed, inject, provide } from 'vue'
import { IronswornActor } from '../../actor/actor'
import { $ActorKey, $ItemKey } from '../provisions'
import { throttle } from 'lodash'
import BtnFaicon from './buttons/btn-faicon.vue'
import BtnCompendium from './buttons/btn-compendium.vue'
import MceEditor from './mce-editor.vue'
import ProgressEmbed from './progress/progress-embed.vue'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()

const $actor = inject($ActorKey)

const progressItemData = props.actor?.items.find(
  (x) => x.type === 'progress'
) as any

const progressItem = computed(() =>
  $actor?.items.get((progressItemData as any)?.id)
)
provide($ActorKey, props.actor)
provide($ItemKey, progressItemData)

// async foe(newFoe) {
//   const data = { name: newFoe?.name, img: newFoe?.img }
//   await $actor?.update(data)
//   await $actor?.data.token.update(data)
// },

function addEmpty() {
  Item.create(
    { name: 'NPC', type: 'progress', data: { subtype: 'foe' } },
    { parent: $actor }
  )
}

function saveDescription() {
  progressItem?.update({
    data: { description: progressItemData?.data.description },
  })
}
const throttledSaveDescription = throttle(saveDescription, 1000)
</script>
