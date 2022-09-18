<template>
  <table class="oracle-table">
    <caption
      v-if="!noCaption && oracleTable.data.description"
      v-html="enrichMarkdown(oracleTable.data.description)"
    />
    <thead>
      <tr>
        <th scope="col" class="oracle-table-column-roll">
          {{ $t('IRONSWORN.OracleTable.ColumnLabel.Roll') }}
        </th>
        <th scope="col" class="oracle-table-column-result">
          {{ $t('IRONSWORN.OracleTable.ColumnLabel.Result') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in tableRows">
        <td class="oracle-table-column-roll">{{ rangeString(row) }}</td>
        <td
          class="oracle-table-column-result"
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
import { computed } from '@vue/reactivity'
import { sortBy } from 'lodash'
import { enrichMarkdown } from '../../vue-plugin.js'

const props = defineProps<{ oracleTable: RollTable; noCaption?: boolean }>()

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
    props.oracleTable.data.results.contents.map(
      (row) =>
        ({
          low: row.data.range[0],
          high: row.data.range[1],
          text: row.data.text,
          selected: false,
        } as TableRowData)
    ),
    'low'
  )
)
</script>
