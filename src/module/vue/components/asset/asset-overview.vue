<template>
  <article class="flexcol ironsworn__asset" :class="articleClasses">
    <!--
        Semi-edit view:
        * Text entry for field VALUES (not names)
        * Checkboxes for abilities, settable clocks
        * Selection for exclusive options
        * Track: name and value only
        * Conditions: checkboxes only
       -->

    <header class="asset-header nogrow flexrow">
      <span class="asset-type" aria-label="asset type">
        {{ item.data.category }}
      </span>
    </header>

    <section class="asset-body flexcol">
      <!-- DESCRIPTION -->
      <div
        class="nogrow"
        v-if="item.data.description"
        v-html="$enrichHtml(item.data.description)"
      ></div>

      <!-- FIELDS -->
      <div
        class="form-group nogrow"
        v-for="(field, i) in item.data.fields"
        :key="`field${i}`"
      >
        <label>{{ field.name }}</label>
        <input type="text" v-model="field.value" @blur="saveFields" />
      </div>

      <!-- REQUIREMENT -->
      <p
        class="nogrow"
        v-if="item.data.requirement"
        v-html="$enrichMarkdown(item.data.requirement)"
      ></p>

      <!-- ABILITIES -->
      <ul class="asset-abilities flexcol nogrow">
        <WithRollListeners
          v-for="(ability, i) in item.data.abilities"
          :key="`ability${i}`"
          element="li"
          :class="{
            'asset-ability': true,
            marked: ability.enabled,
            [`bullet-${toolset ?? 'ironsworn'}`]: true,
          }"
          @click="toggleAbility(i)"
          @moveclick="moveClick"
        >
          <div
            class="asset-ability-text flexcol"
            v-html="ability.description"
          ></div>
        </WithRollListeners>
      </ul>

      <!-- OPTIONS -->

      <!-- TRACK -->

      <!-- CONDITIONS -->
    </section>
  </article>
</template>

<style lang="less" module>
.ironsworn__asset {
  margin: 10px 0;
  padding: 5px;
  --ironsworn-color-thematic: v-bind('item.data.color');
}

input[type='text'] {
  border: 0;
  outline: 0;
}
</style>

<script lang="ts" setup>
import { computed, ComputedRef, inject, useCssModule } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import WithRollListeners from '../with-rolllisteners.vue'

const $item = inject($ItemKey)
const item = inject(ItemKey) as ComputedRef

const toolset = computed<'ironsworn' | 'starforged' | undefined>(
  () => $item?.actor?.toolset
)

const cssModule = useCssModule()
const articleClasses = computed(() => {
  const cls = {
    [cssModule.ironsworn__asset]: true,
    [`asset-${toolset.value ?? 'ironsworn'}`]: true,
  }
  if (toolset.value) cls[`asset-${toolset.value}`] = true
  return cls
})

function saveFields() {
  const fields = item.value?.data.fields
  $item?.update({ data: { fields } })
}

function toggleAbility(i: number) {
  const { abilities } = item.value.data
  abilities[i].enabled = !abilities[i].enabled
  $item?.update({ data: { abilities } })
}

function moveClick(item) {
  CONFIG.IRONSWORN.emitter.emit('highlightMove', item.id)
}
</script>
