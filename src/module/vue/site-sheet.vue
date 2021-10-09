<template>
  <div class="flexcol">
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
          :placeholder="$t('IRONSWORN.Name')"
          v-model="actor.name"
          name="name"
          type="text"
        />
      </h1>
    </header>

    <div class="flexrow nogrow">
      <rank-hexes :current="actor.data.rank" @click="setRank" />
      <icon-button v-if="editMode" icon="trash" @click="clearProgress" />
      <icon-button icon="play" @click="markProgress" />
    </div>

    <div class="flexrow track nogrow" style="margin-bottom: 1em">
      <progress-track :ticks="actor.data.current" />
    </div>

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

    <h4 class="flexrow nogrow">{{ $t('IRONSWORN.Moves') }}</h4>

    <div class="boxgroup moves nogrow" style="margin-bottom: 1em">
      <div class="flexrow boxrow">
        <site-movebox move="Delve the Depths" />
        <div
          class="box flexrow clickable block"
          :class="{ disabled: !hasThemeAndDomain }"
        >
          <h4>{{ $t('IRONSWORN.Feature') }}</h4>
        </div>
        <site-movebox move="Reveal a Danger" />
      </div>
      <div class="flexrow boxrow">
        <site-movebox move="Find an Opportunity" />
        <site-movebox move="Locate Your Objective" />
        <site-movebox move="Escape the Depths" />
      </div>
    </div>

    <h4 class="flexrow nogrow">
      <span>{{ $t('IRONSWORN.Denizens') }}</span>
      <icon-button icon="dice-36" @click="randomDenizen" />
      <icon-button icon="atlas" @click="openFoeCompendium" />
    </h4>

    <div class="boxgroup nogrow">
      <div class="flexrow boxrow">
        <site-denizenbox :actor="actor" :idx="0" />
        <site-denizenbox :actor="actor" :idx="1" />
        <site-denizenbox :actor="actor" :idx="2" />
        <site-denizenbox :actor="actor" :idx="3" />
      </div>
      <div class="flexrow boxrow">
        <site-denizenbox :actor="actor" :idx="4" />
        <site-denizenbox :actor="actor" :idx="5" />
        <site-denizenbox :actor="actor" :idx="6" />
        <site-denizenbox :actor="actor" :idx="7" />
      </div>
      <div class="flexrow boxrow">
        <site-denizenbox :actor="actor" :idx="8" />
        <site-denizenbox :actor="actor" :idx="9" />
        <site-denizenbox :actor="actor" :idx="10" />
        <site-denizenbox :actor="actor" :idx="11" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
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
</style>

<script>
export default {
  props: {
    actor: Object,
  },

  computed: {
    ironswornActor() {
      console.log(this.actor)
      return game.actors?.get(this.actor._id)
    },

    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },

    theme() {
      return this.actor.items.find((x) => x.type === 'delve-theme')
    },

    domain() {
      return this.actor.items.find((x) => x.type === 'delve-domain')
    },

    hasThemeAndDomain() {
      return this.theme && this.domain
    },
  },

  methods: {
    setRank(rank) {
      this.ironswornActor.update({ data: { rank } })
    },

    clearProgress() {
      this.ironswornActor.update({ 'data.current': 0 })
    },

    markProgress() {
      const increment = CONFIG.IRONSWORN.RankIncrements[this.actor.data.rank]
      const newValue = Math.min(this.actor.data.current + increment, 40)
      this.ironswornActor.update({ 'data.current': newValue })
    },
  },
}
</script>
