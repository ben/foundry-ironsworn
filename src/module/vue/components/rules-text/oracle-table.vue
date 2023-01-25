<template>
  <table class="oracle-table">
    <caption
      v-if="!noCaption && (data.table as any)?.description"
      v-html="enrichMarkdown((data.table as any)?.description ?? '')"
    />
    <thead>
      <tr>
        <th scope="col" class="oracle-table-column-roll-range">
          {{ $t('IRONSWORN.OracleTable.ColumnLabel.Roll') }}
        </th>
        <th scope="col" class="oracle-table-column-result-text">
          {{ $t('IRONSWORN.OracleTable.ColumnLabel.Result') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in tableRows">
        <td class="oracle-table-column-roll-range">{{ rangeString(row) }}</td>
        <td
          class="oracle-table-column-result-text"
          v-html="$enrichHtml(row.text)"
        ></td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="less" scoped>
caption,
th {
  text-align: left;
}

th,
td {
  &:first-child {
    padding-inline-start: var(--ironsworn-spacer-xs);
  }

  &:last-child {
    padding-inline-end: var(--ironsworn-spacer-xs);
  }
}
</style>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { sortBy } from 'lodash'
import { reactive } from 'vue'
import { enrichMarkdown } from '../../vue-plugin.js'

// FIXME: use v10 types when available, or hack some together for tables
const props = defineProps<{
  oracleTable: () => RollTable | Promise<RollTable>
  noCaption?: boolean
}>()

const data = reactive<{ table?: RollTable }>({})
Promise.resolve().then(async () => {
  data.table = await props.oracleTable()
})

type TableRowData = {
  low: number
  high: number
  text: string
  selected: boolean
}

function rangeString({ low, high }: TableRowData) {
  if (low === high) {
    return low.toString()
  }
  return `${low}-${high}`
}
const tableRows = computed(() => {
  if (!data.table) return []
  return sortBy(
    data.table.results.contents.map(
      (row: any) =>
        ({
          low: row.range[0],
          high: row.range[1],
          text: row.text,
          selected: false,
        } as TableRowData)
    ),
    'low'
  )
})
</script>
