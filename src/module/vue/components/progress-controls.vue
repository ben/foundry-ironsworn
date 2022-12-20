<template>
  <div class="flexrow nogrow" :class="$style.progressControls">
    <IronBtn
      :class="$style.progressControlBtn"
      block
      icon="fa:plus"
      @click="addProgressItem('vow')"
      :text="$t('IRONSWORN.Vow')"
    />
    <IronBtn
      :class="$style.progressControlBtn"
      block
      icon="fa:plus"
      @click="addProgressItem('progress')"
      :text="$t('IRONSWORN.Progress')"
    />
    <btn-compendium
      :class="$style.progressControlBtn"
      block
      :compendium="props.foeCompendium ?? 'ironswornfoes'"
      :text="$t('IRONSWORN.Foes')"
    />
  </div>
</template>
<style lang="scss" module>
.progressControls {
}

.progressControlBtn {
  --ironsworn-line-height: var(--ironsworn-line-height-sm);
}
</style>

<script setup lang="ts">
import { capitalize, inject } from 'vue'
import { $ActorKey } from '../provisions'
import IronBtn from './buttons/iron-btn.vue'
import BtnCompendium from './buttons/btn-compendium.vue'

const props = defineProps<{ foeCompendium?: string }>()

const $actor = inject($ActorKey)

async function addProgressItem(subtype) {
  const itemData = {
    name: capitalize(subtype),
    type: 'progress',
    data: { subtype },
    sort: 9000000,
  }
  const item = await Item.create(itemData as any, { parent: $actor })
  item?.sheet?.render(true)
}
</script>
