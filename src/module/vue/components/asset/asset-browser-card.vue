
<template>
  <div class="draggable">
    <h3>{{ foundryItem.name }}</h3>
  </div>
</template>

<script setup lang="ts">
import { IAsset } from 'dataforged'
import { IronswornItem } from '../../../item/item'

const props = defineProps<{
  df: IAsset
  foundryItem: Readonly<IronswornItem>
}>()
</script>
