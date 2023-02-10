<template>
  <div class="flexcol">
    <h4 class="nogrow">
      {{ $t('IRONSWORN.Region') }}
      <i class="fa fa-circle-question" data-tooltip="IRONSWORN.RegionTip"></i>
    </h4>
    <label class="nogrow">
      <input type="radio" v-model="data.region" value="terminus" />
      {{ $t('IRONSWORN.REGION.Terminus') }}
    </label>
    <label class="nogrow">
      <input type="radio" v-model="data.region" value="outlands" />
      {{ $t('IRONSWORN.REGION.Outlands') }}
    </label>
    <label class="nogrow">
      <input type="radio" v-model="data.region" value="expanse" />
      {{ $t('IRONSWORN.REGION.Expanse') }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

const props = defineProps<{ data: { sceneId: string } }>()

function foundryScene() {
  const scene = game.scenes?.get(props.data.sceneId)
  console.log(scene)
  return scene
}
const scene = computed(() => foundryScene()?.toObject() as any)

const data = reactive({
  region: scene.value?.flags['foundry-ironsworn']?.['region'],
})
watch(data, ({ region }) => {
  foundryScene()?.setFlag('foundry-ironsworn', 'region', region)
})
</script>
