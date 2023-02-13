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
        <div class="box flexcol" :class="$style.box" style="height: 100%">
          <h4>{{ $capitalize($t('IRONSWORN.Momentum')) }}</h4>
          <h4>{{ data.actor.system.momentum }}</h4>
          <div class="flexrow" style="flex: 1">
            <IronBtn icon="fa:subtract" />
            <IronBtn icon="fa:flame" />
            <IronBtn icon="fa:plus" />
          </div>
        </div>
        <div class="box flexcol">health</div>
        <div class="box flexcol">spirit</div>
        <div class="box flexcol">supply</div>
      </div>
    </section>

    <section class="flexrow nogrow" :class="$style.conditions">
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

  label {
    flex-grow: 0;
  }
}
</style>

<script setup lang="ts">
import { provide, computed } from 'vue'
import AttrBox from './components/attr-box.vue'
import IronBtn from './components/buttons/iron-btn.vue'
import ConditionCheckbox from './components/conditions/condition-checkbox.vue'
import { ActorKey } from './provisions'

const props = defineProps<{
  data: {
    actor: any
  }
}>()

provide(ActorKey, computed(() => props.data.actor) as any)
</script>
