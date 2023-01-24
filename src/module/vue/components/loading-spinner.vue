<template>
  <GridLoader
    :loading="true"
    color="#ccc"
    style="margin: auto; max-width: 57px"
  />
</template>

<script lang="ts" setup>
import * as Loaders from 'vue-spinner/src/index'

const GridLoader = Loaders.GridLoader
</script>
