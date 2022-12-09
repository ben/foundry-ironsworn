<template>
  <table class="oracle-table">
    <caption
      v-if="!noCaption && (oracleTable().system as any).description"
      v-html="enrichMarkdown(oracleTable().system.description ?? '')"
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
    padding-inline-start: 2px;
  }
}
th,
td {
  &:last-child {
    padding-inline-end: 2px;
  }
}
</style>

<script setup lang="ts">
import {
  RollTableData,
  TableResultData,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs'
import { computed } from '@vue/reactivity'
import { sortBy } from 'lodash'
import { enrichMarkdown } from '../../vue-plugin.js'

type TableResultV10 = TableResult & TableResultData
type RollTableV10 = any // excessive type recursion makes typing this futile, unfortunately

const props = defineProps<{
  oracleTable: () => RollTableV10
  noCaption?: boolean
}>()

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

const tableRows = computed(() =>
  sortBy(
    (props.oracleTable() as any).results.contents.map(
      (row) =>
        ({
          low: (row as TableResultV10).range[0],
          high: (row as TableResultV10).range[1],
          text: (row as TableResultV10).text,
          selected: false,
        } as TableRowData)
    ),
    'low'
  )
)
</script>
