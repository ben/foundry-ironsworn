<template>
  <article class="flexcol">
    <ProgressList
      :showCompleted="'all'"
      :excludedSubtypes="['vow', 'progress']"
      :progress-stars="true"
      ref="$connectionList"
    />
    <section
      class="progress-controls flexrow nogrow"
      style="text-align: center"
    >
      <IronBtn
        icon="fa:plus"
        block
        @click="newConnection"
        :text="$t('IRONSWORN.Connection')"
      />
    </section>
  </article>
</template>
<script setup lang="ts">
import { inject } from 'vue'
import { $ActorKey } from '../../provisions'
import IronBtn from '../buttons/iron-btn.vue'
import ProgressList from '../progress-list.vue'

const $actor = inject($ActorKey)

async function newConnection() {
  const item = await Item.create(
    {
      name: game.i18n.localize('IRONSWORN.Connection'),
      type: 'progress',
      system: { subtype: 'bond' },
      sort: 9000000,
    },
    { parent: $actor }
  )
  item?.sheet?.render(true)
}
</script>
