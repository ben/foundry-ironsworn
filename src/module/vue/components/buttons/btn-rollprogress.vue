<template>
  <IronBtn
    @click="rollProgress()"
    :tooltip="$t('IRONSWORN.MakeAProgressRoll', { score: progressScore })"
    class="progress-roll"
    icon="ironsworn:d10-tilt"
    v-bind="($props, $attrs)"
  >
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </IronBtn>
</template>

<script setup lang="ts">
import { ExtractPropTypes, computed, inject } from 'vue'
import { $ItemKey } from '../../provisions'
import IronBtn from './iron-btn.vue'

interface Props extends ExtractPropTypes<typeof IronBtn> {
  item: any
}

const props = defineProps<Props>()

const $item = inject($ItemKey, undefined)

const progressScore = computed(() => {
  return Math.floor(props.item.system.current / 4)
})

function rollProgress() {
  $item?.fulfill()
}
</script>
