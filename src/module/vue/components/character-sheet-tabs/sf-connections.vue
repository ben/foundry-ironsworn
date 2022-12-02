<template>
  <article class="flexcol">
    <section
      class="progress-controls flexrow nogrow"
      style="text-align: center"
    >
      <BtnFaicon icon="plus" class="block" @click="newConnection">
        {{ $t('IRONSWORN.Connection') }}
      </BtnFaicon>
    </section>
    <ProgressList
      :showCompleted="'all'"
      :excludedSubtypes="['vow', 'progress']"
      :showStar="true"
      ref="$connectionList"
    />
  </article>
</template>
<script setup lang="ts">
import { inject } from 'vue'
import { $ActorKey } from '../../provisions'
import BtnFaicon from '../buttons/btn-faicon.vue'
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
