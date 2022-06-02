<template>
  <!-- TODO: revise expandable components to accomodate this -->
  <article class="ironsworn__asset">
    <header class="asset-entry" @click="toggle">
      <h1 class="asset-title">{{ asset.name }}</h1>
      <icon-button v-if="editMode" icon="trash" @click="destroy" />
      <icon-button icon="edit" @click="edit" />
    </header>
    <transition name="slide">
      <section class="flexcol asset-summary" v-if="expanded">
        <p class="asset-field" v-for="(field, i) in asset.data.fields" :key="'field' + i">
          <strong>{{ field.name }}:</strong> {{ field.value }}
        </p>

        <ul class="asset-abilities">
          <with-rolllisteners
            v-for="(ability, i) in enabledAbilities"
            :key="'ability' + i"
            element="li"
            class="asset-ability fas fa-circle"
            :actor="actingActor"
            @moveclick="moveclick"
          >
            <section v-html="$enrichHtml(ability.description)"></section>
            <clock
              v-if="ability.hasClock"
              class="nogrow"
              style="flex-basis: 100px"
              :wedges="ability.clockMax"
              :ticked="ability.clockTicks"
              @click="setAbilityClock(i, $event)"
            />
          </with-rolllisteners>
        </ul>

        <condition-meter
          v-if="asset.data.track.enabled"
          :embedButtonInBar="true"
          class="asset-meter"
          :actor="actor"
          attr="track"
          min="0"
          :tooltip="rollTooltip"
          :max="asset.data.track.max"
          :item="asset"
        >
          {{ asset.data.track.name }}
        </condition-meter>

        <div class="flexcol stack nogrow" style="margin-top: 5px" v-if="asset.data.exclusiveOptions.length > 0">
          <asset-exclusiveoption
            v-for="(opt, i) in asset.data.exclusiveOptions"
            :key="'option' + i"
            :opt="opt"
            @click="exclusiveOptionClick(i)"
          />
        </div>
      </section>
    </transition>
  </article>
</template>

<style lang="less">
@import '../../../../styles/mixins.less';

.ironsworn__asset {
  flex-grow: 1;
  header.asset-entry {
    flex-grow: 0;
    align-items: center;
    flex-flow: row nowrap;
    display: flex;
    justify-content: space-between;
    display: flex;
    flex-flow: row nowrap;
    & > button {
      flex-grow: 0;
    }

    .asset-title {
      margin: 0;
      line-height: 1;
      flex-grow: 1;
      font-size: var(--font-size-16);
    }
    h3,
    .h3 {
      margin-bottom: 0;
    }
  }

  .asset-summary {
    transition: all 0.5s ease;
    overflow: hidden;
    gap: 0.5rem;
    &.collapsed {
      height: 0px;
    }
    ul,
    ol {
      margin: 0;
    }
    .asset-abilities {
      padding: 0;
      gap: 0.5rem;
      .asset-ability {
        display: flex;
        flex-flow: row nowrap;
        gap: 0.5rem;
        &:before {
          margin-top: 0.25em;
        }
      }
    }
    .slide-enter-active,
    .slide-leave-active {
      max-height: 350px;
    }
  }
  .asset-meter {
    &.condition-meter {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      gap: 5px;

      .resource-meter {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-grow: 1;
        flex-direction: row;
        .action-roll {
          flex-grow: 0;
        }
        .meter-box {
          width: max-content;
          min-width: unset;
          flex-basis: 0;
          flex-grow: 1;
        }
      }
    }
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    asset: Object,
  },

  computed: {
    rollTooltip() {
      return `Roll +${this.asset.data.track.name.toLowerCase()} for this asset`
    },
    expanded() {
      return this.asset?.flags['foundry-ironsworn']?.expanded || false
    },
    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },
    enabledAbilities() {
      const abilities = Object.values(this.asset.data.abilities)
      return abilities.filter((x) => x.enabled)
    },
    foundryActor() {
      return game.actors?.get(this.actor._id)
    },
    foundryItem() {
      return this.foundryActor?.items.get(this.asset._id)
    },
    actingActor() {
      if (this.actor.type === 'character') return this.actor
      return CONFIG.IRONSWORN.defaultActor()?.toObject(false)
    },
  },

  methods: {
    toggle() {
      this.foundryItem?.setFlag('foundry-ironsworn', 'expanded', !this.asset?.flags['foundry-ironsworn']?.expanded)
    },
    edit(ev) {
      ev.stopPropagation()
      this.foundryItem.sheet.render(true)
      return false
    },
    destroy(ev) {
      ev.stopPropagation()

      Dialog.confirm({
        title: this.$t('IRONSWORN.DeleteAsset'),
        content: `<p><strong>${this.$t('IRONSWORN.ConfirmDelete')}</strong></p>`,
        yes: () => this.foundryItem?.delete(),
        defaultYes: false,
      })
    },
    rollTrack() {
      CONFIG.IRONSWORN.RollDialog.show({
        actor: this.foundryActor,
        asset: this.foundryItem,
        stat: 'track',
      })
    },
    exclusiveOptionClick(selectedIdx) {
      const options = this.asset.data.exclusiveOptions
      for (let i = 0; i < options.length; i++) {
        options[i].selected = i === selectedIdx
      }
      this.foundryItem.update({ data: { exclusiveOptions: options } })
    },
    moveclick(item) {
      let actorWithMoves = this.$actor
      if (this.$actor?.type !== 'character') {
        actorWithMoves = CONFIG.IRONSWORN.defaultActor()
      }
      actorWithMoves?.moveSheet?.render(true)
      actorWithMoves?.moveSheet?.highlightMove(item)
    },

    setAbilityClock(abilityIdx, clockTicks) {
      const abilities = Object.values(this.asset.data.abilities)
      abilities[abilityIdx] = { ...abilities[abilityIdx], clockTicks }
      this.foundryItem.update({ data: { abilities } })
    },
  },
}
</script>
