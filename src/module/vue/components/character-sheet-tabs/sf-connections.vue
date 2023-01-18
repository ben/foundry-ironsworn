<template>
  <article class="flexcol">
    <ProgressList
      :showCompleted="'all'"
      :excludedSubtypes="['vow', 'progress']"
      :progress-stars="true"
      ref="$connectionList"
    />
    <section
      :class="$style.listControls"
      class="progress-controls flexrow nogrow"
    >
      <IronBtn
        icon="fa:plus"
        block
        @click="newConnection"
        :text="$t('IRONSWORN.ITEM.SubtypeConnection')"
      />
    </section>
  </article>
</template>
<style lang="less" module>
.listControls {
  --ironsworn-line-height: var(--ironsworn-line-height-sm);
}
</style>
<script setup lang="ts">
import { inject } from 'vue'
import { $ActorKey } from '../../provisions'
import IronBtn from '../buttons/iron-btn.vue'
import ProgressList from '../progress-list.vue'

const $actor = inject($ActorKey)

async function newConnection() {
  const item = await Item.create(
    {
      name: game.i18n.localize('IRONSWORN.ITEM.SubtypeConnection'),
      type: 'progress',
      system: { subtype: 'bond' },
      sort: 9000000,
    },
    { parent: $actor }
  )
  item?.sheet?.render(true)
}
</script>
