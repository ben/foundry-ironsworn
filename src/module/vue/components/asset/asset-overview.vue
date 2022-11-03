<template>
  <article>
    <!--
        Semi-edit view:
        * Text entry for field VALUES (not names)
        * Checkboxes for visible abilities
        * Selection for exclusive options
        * Track: name and value only
        * Conditions: checkboxes only
       -->

    <h3 v-if="item?.data?.category">{{ item.data.category }}</h3>
  </article>
</template>

<script lang="ts" setup>
import { ComputedRef, inject } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'

const $item = inject($ItemKey)
const item = inject(ItemKey) as ComputedRef
</script>
