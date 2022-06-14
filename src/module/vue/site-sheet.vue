<template>
  <div class="flexcol site-sheet">
    <!-- HEADER -->
    <header class="sheet-header">
      <document-img :document="actor" />
      <document-name :document="actor" />
    </header>

    <!-- RANK -->
    <div class="flexrow nogrow">
      <challengerank-pips :current="actor.data.rank" @click="setRank" class="nogrow" style="margin-right: 1em" />
      <h4>{{ rankText }}</h4>
      <btn-faicon v-if="editMode" icon="trash" @click="clearProgress" />
      <btn-faicon icon="play" @click="markProgress" />
    </div>

    <!-- PROGRESS -->
    <div class="flexrow track nogrow" style="margin-bottom: 1em">
      <progress-track :ticks="actor.data.current" />
    </div>

    <!-- THEME/DOMAIN -->
    <div class="boxgroup flexcol nogrow" style="margin-bottom: 1em">
      <div class="flexrow boxrow nogrow">
        <site-droparea
          class="box"
          :actor="actor"
          :item="theme"
          item-type="delve-theme"
          compendium-key="ironsworndelvethemes"
          title-key="IRONSWORN.Theme"
        />
        <site-droparea
          class="box"
          :actor="actor"
          :item="domain"
          item-type="delve-domain"
          compendium-key="ironsworndelvedomains"
          title-key="IRONSWORN.Domain"
        />
      </div>
    </div>

    <!-- MOVES -->
    <h4 class="flexrow nogrow">{{ $t('IRONSWORN.Moves') }}</h4>
    <div class="boxgroup moves nogrow" style="margin-bottom: 1em">
      <div class="flexrow boxrow">
        <site-movebox :actor="actor" move="Delve the Depths" />
        <div class="box flexrow clickable block" :aria-disabled="!hasThemeAndDomain" @click="randomFeature">
          <h4>{{ $t('IRONSWORN.Feature') }}</h4>
        </div>
        <site-movebox :actor="actor" move="Reveal a Danger" :disabled="!hasThemeAndDomain" />
      </div>
      <div class="flexrow boxrow">
        <site-movebox :actor="actor" move="Find an Opportunity" />
        <div class="box flexrow clickable block" @click="locateObjective">
          <h4>
            {{ $t('IRONSWORN.MoveContents.Locate Your Objective.title') }}
          </h4>
        </div>
        <site-movebox :actor="actor" move="Escape the Depths" />
      </div>
    </div>

    <!-- DENIZENS -->
    <h4 class="flexrow nogrow">
      <span>{{ $t('IRONSWORN.Denizens') }}</span>
      <i class="flexrow nogrow clickable text isicon-d10-tilt" style="padding: 2px" @click="randomDenizen" />
      <btn-compendium compendium="ironswornfoes"></btn-compendium>
    </h4>
    <div class="boxgroup nogrow" style="margin-bottom: 1em">
      <div class="flexrow boxrow">
        <site-denizenbox :actor="actor" :idx="0" ref="denizen-0" />
        <site-denizenbox :actor="actor" :idx="1" ref="denizen-1" />
        <site-denizenbox :actor="actor" :idx="2" ref="denizen-2" />
        <site-denizenbox :actor="actor" :idx="3" ref="denizen-3" />
      </div>
      <div class="flexrow boxrow">
        <site-denizenbox :actor="actor" :idx="4" ref="denizen-4" />
        <site-denizenbox :actor="actor" :idx="5" ref="denizen-5" />
        <site-denizenbox :actor="actor" :idx="6" ref="denizen-6" />
        <site-denizenbox :actor="actor" :idx="7" ref="denizen-7" />
      </div>
      <div class="flexrow boxrow">
        <site-denizenbox :actor="actor" :idx="8" ref="denizen-8" />
        <site-denizenbox :actor="actor" :idx="9" ref="denizen-9" />
        <site-denizenbox :actor="actor" :idx="10" ref="denizen-10" />
        <site-denizenbox :actor="actor" :idx="11" ref="denizen-11" />
      </div>
    </div>

    <!-- NOTES -->
    <h4 class="nogrow">{{ $t('IRONSWORN.Notes') }}</h4>
    <textarea v-model="actor.data.description" @blur="saveDescription" />
  </div>
</template>

<style lang="less">
.site-sheet {
  .moves {
    .box {
      justify-content: center;
      padding: 5px;
    }
    h4 {
      margin: 0;
      white-space: nowrap;
    }
  }

  textarea {
    border-color: rgba(0, 0, 0, 0.1);
    border-radius: 1px;
    resize: none;
    font-family: var(--font-primary);
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
  },

  computed: {
    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },

    theme() {
      return this.actor.items.find((x) => x.type === 'delve-theme')
    },
    ironswornTheme() {
      return this.$actor.items.find((x) => x.id === this.theme._id)
    },

    domain() {
      return this.actor.items.find((x) => x.type === 'delve-domain')
    },
    ironswornDomain() {
      return this.$actor.items.find((x) => x.id === this.domain._id)
    },

    hasThemeAndDomain() {
      return this.theme && this.domain
    },

    rankText() {
      return this.$t(CONFIG.IRONSWORN.Ranks[this.actor.data.rank])
    },
  },

  methods: {
    setRank(rank) {
      this.$actor.update({ data: { rank } })
    },

    clearProgress() {
      this.$actor.update({ 'data.current': 0 })
    },

    markProgress() {
      const increment = CONFIG.IRONSWORN.RankIncrements[this.actor.data.rank]
      const newValue = Math.min(this.actor.data.current + increment, 40)
      this.$actor.update({ 'data.current': newValue })
    },

    openFoeCompendium() {
      const pack = game.packs?.get(`foundry-ironsworn.ironswornfoes`)
      pack?.render(true)
    },

    randomFeature() {
      if (!this.hasThemeAndDomain) return
      CONFIG.IRONSWORN.rollSiteFeature({
        theme: this.ironswornTheme,
        domain: this.ironswornDomain,
      })
    },

    async locateObjective() {
      const move = await CONFIG.IRONSWORN.moveDataByName('Locate Your Objective')
      const progress = Math.floor(this.actor.data.current / 4)
      const roll = new Roll(`{${progress}, d10, d10}`)
      CONFIG.IRONSWORN.createIronswornChatRoll({
        isProgress: true,
        move,
        roll,
        subtitle: this.actor.name || undefined,
      })
    },

    async randomDenizen() {
      const roll = await new Roll('1d100').evaluate({ async: true })
      const result = roll.total
      const denizen = this.$actor.data.data.denizens.find((x) => x.low <= result && x.high >= result)
      const idx = this.$actor.data.data.denizens.indexOf(denizen)
      if (!denizen) throw new Error(`Rolled a ${result} but got no denizen???`)
      await CONFIG.IRONSWORN.createIronswornDenizenChat({
        roll,
        denizen,
        site: this.$actor,
      })

      // Denizen slot is empty; set focus and add a class
      if (!denizen?.description) {
        await this.$actor.setFlag('foundry-ironsworn', 'edit-mode', true)
        this.$refs[`denizen-${idx}`]?.focus()
      }
    },

    async saveDescription() {
      this.$actor.update({ 'data.description': this.actor.data.description })
    },
  },
}
</script>
