<template>
  <div class="item-row ironsworn__asset">
    <div class="asset-entry" @click="toggle">
      <div class="flexrow">
        <h4 style="margin: 0; line-height: 20px">{{ asset.name }}</h4>
        <icon-button v-if="editMode" icon="trash" @click="destroy" />
        <icon-button icon="edit" @click="edit" />
      </div>
    </div>
    <div class="flexcol asset-summary" :class="collapsedClass">
      <p v-for="(field, i) in asset.data.fields" :key="i">
        <strong>{{ field.name }}:</strong> {{ field.value }}
      </p>

      <p
        v-if="asset.data.description"
        v-html="$enrichHtml(asset.data.description)"
      />

      <ul>
        <li
          v-for="(ability, i) in enabledAbilities"
          :key="i"
          v-html="$enrichHtml(ability.description)"
        ></li>
      </ul>

      <!-- <div class="flexcol" v-if="asset.data.track.enabled">
        <h4
          style="margin-bottom: 3px"
          class="clickable text ironsworn__assettrack__roll"
        >
          {{ asset.data.track.name }}
        </h4>
        <div class="flexrow track">
          {{#rangeEach from=0 to=data.data.track.max
                        current=data.data.track.current}}
          <div
            class="track-box clickable block ironsworn__assettrack__value
                                                  {{#if isCurrent}} selected {{/if}}
                                                "
            data-item="{{id}}"
            data-value="{{value}}"
          >
            {{ value }}
          </div>
          {{/rangeEach}}
        </div>
      </div> -->

      <div
        class="flexcol stack nogrow"
        style="margin-top: 5px"
        v-if="asset.data.exclusiveOptions.length > 0"
      >
        <div
          v-for="(opt, i) in asset.data.exclusiveOptions"
          :key="i"
          class="clickable block stack-row ironsworn__assetoption"
        >
          <!-- {{#if selected}}selected{{/if}} -->
          {{ opt.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import iconButton from '../icon-button.vue'
export default {
  components: { iconButton },
  props: {
    actor: Object,
    asset: Object,
  },

  computed: {
    collapsedClass() {
      return {
        collapsed: this.asset.flags['foundry-ironsworn']['expanded'],
      }
    },
    editMode() {
      return this.actor.flags['foundry-ironsworn']['edit-mode']
    },
    enabledAbilities() {
      const abilities = Object.values(this.asset.data.abilities)
      return abilities.filter((x) => x.enabled)
    },
    foundryItem() {
      const actor = game.actors?.get(this.actor._id)
      return actor?.items.get(this.asset._id)
    },
  },

  methods: {
    toggle() {
      this.foundryItem?.setFlag(
        'foundry-ironsworn',
        'expanded',
        !this.foundryItem.getFlag('foundry-ironsworn', 'expanded')
      )
    },
    edit(ev) {
      ev.stopPropagation()
      this.foundryItem.sheet.render(true)
      return false
    },
  },
}
</script>
