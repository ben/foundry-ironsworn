<template>
  <header class="sheet-header">
    <img
      :src="actor.img"
      :title="actor.name"
      class="profile-img"
      data-edit="img"
      height="50"
      width="50"
    />
    <h1 class="charname">
      <input
        type="text"
        name="name"
        class="input-secondary"
        v-model="actor.name"
      />
      <!-- <input
        :value="actor.name"
        :placeholder="localize('IRONSWORN.Name')"
        name="name"
        type="text"
      /> -->
    </h1>
    <div class="flexrow xp">
      <h4 style="flex-grow: 0; margin: 5px">{{ localize('IRONSWORN.XP') }}</h4>
      <div class="flexrow">
        <!-- {{#rangeEach from=1 to=9 current=data.data.xp}}
        <div class="
                    clickable block xp
                    ironsworn__stat__value
                    {{#if lteCurrent}} selected {{/if}}
                " data-resource="xp" data-value="{{value}}"></div>
        {{/rangeEach}} -->
        <div
          class="clickable block xp clear ironsworn__stat__value"
          data-resource="xp"
          data-value="0"
        >
          ×
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['actor'],
})
</script>
