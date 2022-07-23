<template>
  <div class="flexcol">
    <h4 class="nogrow">{{ $t('IRONSWORN.Region') }}</h4>
    <label class="nogrow">
      <input type="radio" v-model="data.region" value="terminus" />
      {{ $t('IRONSWORN.Terminus') }}
    </label>
    <label class="nogrow">
      <input type="radio" v-model="data.region" value="outlands" />
      {{ $t('IRONSWORN.Outlands') }}
    </label>
    <label class="nogrow">
      <input type="radio" v-model="data.region" value="expanse" />
      {{ $t('IRONSWORN.Expanse') }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'

const props = defineProps<{ sceneid: string }>()

function foundryScene() {
  return game.scenes?.get(props.sceneid)
}
const scene = computed(() => foundryScene()?.toObject() as any)

const data = reactive({
  region: scene.value?.flags['foundry-ironsworn']?.['region'],
})
watch(data, ({ region }) => {
  foundryScene()?.setFlag('foundry-ironsworn', 'region', region)
})
</script>
