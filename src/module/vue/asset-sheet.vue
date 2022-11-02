<template>
  <div>
    <SheetHeader class="nogrow">
      <document-name :document="item" />
    </SheetHeader>

    <Tabs v-if="editMode">
      <Tab :title="$t('IRONSWORN.Description')">
        <!-- TEXT INPUTS -->
        <div class="form-group">
          <label style="grid-column: 1; grid-row: 1">
            {{ $t('IRONSWORN.Category') }}
          </label>
          <input
            style="grid-row: 1; grid-column: 2"
            type="text"
            v-model="item.data.category"
            @blur="setCategory"
          />
        </div>

        <div class="form-group">
          <label>{{ $t('IRONSWORN.Color') }}</label>
          <input type="color" v-model="item.data.color" @change="setColor" />
        </div>

        <MceEditor
          v-model="item.data.description"
          @save="setDescription"
          :editing="true"
        />
      </Tab>

      <Tab :title="$t('IRONSWORN.Fields')">
        <asset-fieldsedit />
      </Tab>

      <Tab :title="$t('IRONSWORN.Abilities')">
        <asset-abilitiesedit />
      </Tab>

      <Tab :title="$t('IRONSWORN.Options')">
        <asset-optionsedit />
      </Tab>

      <Tab :title="$t('IRONSWORN.Track')">
        <asset-trackedit />
      </Tab>
    </Tabs>

    <article v-else>
      <!--
        Semi-edit view:
        * Text entry for field VALUES (not names)
        * Checkboxes for visible abilities
        * Selection for exclusive options
        * Track: name and value only
        * Conditions: checkboxes only
       -->
      <h3 v-if="item.data.category">{{ item.data.category }}</h3>
    </article>

    <hr />

    <section class="flexrow" style="gap: 5px">
      <input
        v-if="editMode"
        type="text"
        v-model="item.data.category"
        @blur="setCategory"
      />
      <h3 v-else>{{ item.data.category }}</h3>

      <input
        type="color"
        v-if="editMode"
        v-model="item.data.color"
        @change="setColor"
      />
    </section>

    <section style="margin-top: 1em" v-if="item.data.description">
      <div v-if="editMode">
        <label>{{ $t('IRONSWORN.Description') }}</label>
        <input
          type="text"
          v-model="item.data.description"
          @blur="setDescription"
        />
      </div>
      <span v-else v-html="$enrichHtml(item.data.description)"></span>
    </section>

    <section style="margin-top: 1em">
      <div v-if="editMode">
        <label>Requirement</label>
        <input
          type="text"
          v-model="item.data.requirement"
          @blur="setRequirement"
        />
      </div>
      <span v-else v-html="$enrichHtml(item.data.requirement)"></span>
    </section>

    <!-- FIELDS -->
    <div v-if="hasFields || editMode">
      <h3>{{ $t('IRONSWORN.Fields') }}</h3>
      <asset-fieldsedit />
    </div>

    <!-- ABILITIES -->
    <h3>{{ $t('IRONSWORN.Abilities') }}</h3>
    <asset-abilitiesedit />

    <!-- OPTIONS -->
    <div v-if="hasOptions || editMode">
      <h3>{{ $t('IRONSWORN.Options') }}</h3>
      <asset-optionsedit />
    </div>

    <!-- TRACK -->
    <h3>{{ $t('IRONSWORN.Track') }}</h3>
    <asset-trackedit />
  </div>
</template>

<style lang="less" module>
.entrygrid {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
</style>

<style lang="less" scoped>
.fieldrow {
  p,
  input {
    text-align: left;
    padding: 0 0.5em;
    margin: 3px;
  }
}
h3 {
  margin-top: 1em;
}
</style>

<script setup lang="ts">
import { computed, inject, provide, Ref } from 'vue'
import SheetHeader from './sheet-header.vue'
import Tabs from './components/tabs/tabs.vue'
import Tab from './components/tabs/tab.vue'
import MceEditor from './components/mce-editor.vue'
import DocumentName from './components/document-name.vue'
import AssetFieldsedit from './components/asset/asset-fieldsedit.vue'
import AssetAbilitiesedit from './components/asset/asset-abilitiesedit.vue'
import AssetOptionsedit from './components/asset/asset-optionsedit.vue'
import AssetTrackedit from './components/asset/asset-trackedit.vue'
import { $ItemKey, ItemKey } from './provisions'

const $item = inject($ItemKey)

const props = defineProps<{ item: any }>()
provide(ItemKey, computed(() => props.item) as any)

const editMode = computed(() => {
  return props.item.flags['foundry-ironsworn']?.['edit-mode']
})

const hasOptions = computed(() => {
  return Object.values(props.item.data.exclusiveOptions || []).length > 0
})

const hasFields = computed(() => {
  return Object.values(props.item.data.fields || []).length > 0
})

function setRequirement() {
  $item?.update({ data: { requirement: props.item.data.requirement } })
}
function setDescription() {
  $item?.update({ data: { description: props.item.data.description } })
}
function setCategory() {
  $item?.update({ data: { category: props.item.data.category } })
}
function setColor() {
  $item?.update({ data: { color: props.item.data.color } })
}
</script>
