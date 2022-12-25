<template>
  <div class="flexcol">
    <!-- TODO:  -->
    <p class="nogrow">(Dropdown to select toolset)</p>

    <Suspense>
      <SfMovesheetoracles toolset="starforged" />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import SfMovesheetoracles from './components/sf-movesheetoracles.vue'
</script>
