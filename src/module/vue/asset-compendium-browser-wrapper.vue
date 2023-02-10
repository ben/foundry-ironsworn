import { AssetCompendiumBrowser } from '../item/asset-compendium-browser';
import AssetCompendiumBrowser from './asset-compendium-browser.vue';

<template>
  <Suspense>
    <AssetCompendiumBrowser :toolset="data.toolset">
      Loading…
    </AssetCompendiumBrowser>

    <template #fallback>
      <div class="flexrow">
        <loading-spinner />
      </div>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import AssetCompendiumBrowser from './asset-compendium-browser.vue'

const props = defineProps<{ data: { toolset: 'starforged' | 'ironsworn' } }>()
provide('toolset', props.data.toolset)
</script>
