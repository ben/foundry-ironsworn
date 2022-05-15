<template>
  <div class="flexcol ironsworn__drop__target" data-drop-type="asset">
    <transition-group name="slide" tag="div" class="nogrow">
      <div class="flexrow" v-for="(asset, i) in assets" :key="asset._id">
        <div class="flexcol nogrow sortcontrols" v-if="editMode">
          <i
            class="clickable block fas fa-caret-up nogrow"
            :class="{ disabled: i == 0 }"
            @click="sortUp(i)"
          ></i>
          <i
            class="clickable block fas fa-caret-down nogrow"
            :class="{ disabled: i == assets.length - 1 }"
            @click="sortdown(i)"
          ></i>
        </div>
        <asset :actor="actor" :asset="asset" />
      </div>
    </transition-group>
    <div class="flexrow nogrow" style="text-align: center">
      <div class="clickable block" @click="openCompendium">
        <i class="fas fa-atlas" />
        {{ $t('IRONSWORN.Assets') }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.sortcontrols {
  padding-right: 3px;

  i {
    padding: 2px;
  }
}
</style>

<script>
import { sortBy } from 'lodash'

export default {
  props: {
    actor: Object,
  },

  computed: {
    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },

    assets() {
      return this.actor.items.filter((x) => x.type === 'asset')
    },
  },

  methods: {
    openCompendium() {
      const pack = game.packs?.get('foundry-ironsworn.starforgedassets')
      pack?.render(true)
    },
  },
}
</script>
