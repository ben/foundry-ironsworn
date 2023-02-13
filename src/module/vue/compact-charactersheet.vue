<template>
  <div class="flexcol" :class="$style.wrapper">
    <section :class="$style.stats" class="flexrow nogrow">
      <AttrBox style="flex: 1" attr="edge" />
      <AttrBox style="flex: 1" attr="heart" />
      <AttrBox style="flex: 1" attr="iron" />
      <AttrBox style="flex: 1" attr="shadow" />
      <AttrBox style="flex: 1" attr="wits" />
    </section>

    <section class="boxgroup nogrow">
      <div class="flexrow boxrow">
        <CompactCharacterSheetButton prop-key="momentum" />
        <CompactCharacterSheetButton prop-key="health" />
        <CompactCharacterSheetButton prop-key="spirit" />
        <CompactCharacterSheetButton prop-key="supply" />
      </div>
    </section>

    <section class="flexrow" :class="$style.conditions">
      <ConditionCheckbox name="wounded" />
      <ConditionCheckbox name="unprepared" />
      <ConditionCheckbox name="shaken" />
      <ConditionCheckbox name="encumbered" />
    </section>
  </div>
</template>

<style lang="less" module>
.wrapper {
  gap: var(--ironsworn-spacer-lg);
}

.stats {
  gap: var(--ironsworn-spacer-lg);
}

.statbox {
  flex: 1 !important;
}

.box {
  padding: var(--ironsworn-spacer-sm);
}

.conditions {
  justify-content: space-around;
  align-items: center;

  label {
    flex-grow: 0;
  }
}
</style>

<script setup lang="ts">
import { provide, computed } from 'vue'
import AttrBox from './components/attr-box.vue'
import IronBtn from './components/buttons/iron-btn.vue'
import CompactCharacterSheetButton from './components/compact-character-sheet-button.vue'
import ConditionCheckbox from './components/conditions/condition-checkbox.vue'
import { ActorKey } from './provisions'

const props = defineProps<{
  data: {
    actor: any
  }
}>()

provide(ActorKey, computed(() => props.data.actor) as any)
</script>
