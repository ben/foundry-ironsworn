<template>
  <div class="flexrow">
    <div class="flexcol">
      <section class="sheet-area flexcol">
        <!-- Bonds -->
        <Bonds :compactProgress="true" data-tourid="bonds" />

        <hr class="nogrow" />

        <!-- Assets -->
        <AssetsList>
          <template #start>
            <h4 class="nogrow">
              {{ $t('IRONSWORN.ITEMS.TypeAsset') }}
            </h4>
          </template>
        </AssetsList>
      </section>
    </div>
    <ActiveCompletedProgresses
      :compactProgress="true"
      :class="$style.progress"
      data-tourid="progress"
    />
  </div>
</template>
<style lang="scss" module>
.progress {
  margin-top: var(--ironsworn-spacer-md);
}
</style>
<style lang="scss" scoped>
h4 {
  text-transform: uppercase;
}

h3 {
  transition: background-color 0.2s ease;
  margin: var(--ironsworn-spacer-md) 0;

  i {
    width: 15px;
    text-align: center;
  }
}
</style>

<script lang="ts" setup>
import Bonds from '../bonds.vue'
import ActiveCompletedProgresses from '../progress/active-completed-progresses.vue'
import AssetsList from './assets-list.vue'
</script>
