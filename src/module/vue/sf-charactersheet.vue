<template>
<!-- this should either be article or form, probably -->
  <form class="flexcol pc-sheet" autocomplete="off">
    <!-- Header row -->
    <sf-characterheader :actor="actor" />

    <!-- Main body row -->
    <section class="flexrow pc-sheet-main">
      <!-- Momentum on left -->
      <section class="margin-left momentum">
        <label class="h4 vertical-v2">{{ $t('IRONSWORN.Momentum') }}</label>
        <stack
          :actor="actor"
          stat="momentum"
          class="meter stack"
          :top="10"
          :bottom="-6"
          :softMax="actor.data.momentumMax"
        ></stack>
        <!-- <hr class="nogrow" /> -->
        <!-- TODO: replace the HR above with appropriate styling -->

        <button class="clickable block stack-row burn-momentum" @click="burnMomentum">
          {{ $t('IRONSWORN.Burn') }}
        </button>
        <span class="momentum-max-reset">{{ $t('IRONSWORN.Reset') }}: {{ actor.data.momentumReset }}</span>
        <span class="momentum-max-reset">{{ $t('IRONSWORN.Max') }}: {{ actor.data.momentumMax }}</span>
      </section>
      <!-- Stats -->
      <section class="flexrow stats">
        <attr-box :actor="actor" attr="edge"></attr-box>
        <attr-box :actor="actor" attr="heart"></attr-box>
        <attr-box :actor="actor" attr="iron"></attr-box>
        <attr-box :actor="actor" attr="shadow"></attr-box>
        <attr-box :actor="actor" attr="wits"></attr-box>
      </section>
      <section class="tabbed-pages">
          <!-- Tabs -->
          <nav class="flexrow nogrow tabs">
            <!-- TODO: typically, the semantics of tabbed interfaces are best represented by an <a> element, since they're functionally just navigating to another 'page' -->
            <div
              class="tab"
              v-for="tab in tabs"
              :key="tab.titleKey"
              :class="['clickable', 'block', { selected: currentTab === tab }]"
              @click="currentTab = tab"
            >
              {{ $t(tab.titleKey) }}
            </div>
          </nav>
        <!-- content for tabs -->
          <keep-alive>
            <component
              :is="currentTab.component"
              :actor="actor"
              class="tabbed-page"
            />
          </keep-alive>
      </section>
      <!-- Condition meters on right -->
      <section class="flexcol condition-meters margin-right">
        <section class="flexrow nogrow condition-meter meter">
        <!-- TODO: label should probably be preferred to headers in this case -->
          <h4 class="vertical-v2 clickable text" @click="rollStat('health')">
            <i class="isicon-d10-tilt"></i>
            {{ $t('IRONSWORN.Health') }}
          </h4>
          <div class="flexcol stack health">
            <stack :actor="actor" stat="health" :top="5" :bottom="0"></stack>
          </div>
        </section>
<!-- TODO: HR is inappropriate here -->
        <hr class="nogrow" />

        <section class="flexrow nogrow condition-meter meter">
          <h4 class="vertical-v2 clickable text" @click="rollStat('spirit')">
            <i class="isicon-d10-tilt"></i>
            {{ $t('IRONSWORN.Spirit') }}
          </h4>
          <div class="flexcol stack spirit">
            <stack :actor="actor" stat="spirit" :top="5" :bottom="0"></stack>
          </div>
        </section>

        <hr class="nogrow" />

        <section class="flexrow nogrow condition-meter meter">
          <h4 class="vertical-v2 clickable text" @click="rollStat('supply')">
          <!-- TODO: proper aria annotation so non-semantic icon font element is announced/not announced correctly by screen readers.

          or do it with a ::before or normal image stuff.
          -->
            <i class="isicon-d10-tilt"></i>
            {{ $t('IRONSWORN.Supply') }}
          </h4>
          <div class="flexcol stack supply">
            <stack :actor="actor" stat="supply" :top="5" :bottom="0"></stack>
          </div>
        </section>
      </section>
    </section>

    <!-- Impacts -->
    <!-- TODO: ditch the HR. they're for paragraph-level text and have a specific semantic meaning. more info:
    https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr
    -->
    <!-- <hr class="nogrow" /> -->
    <sf-impacts :actor="actor" class="nogrow" />
  </form>
</template>

<script>
export default {
  props: {
    actor: Object,
  },

  data() {
    const tabs = [
      { titleKey: 'IRONSWORN.Legacies', component: 'sf-legacies' },
      { titleKey: 'IRONSWORN.Assets', component: 'sf-assets' },
      { titleKey: 'IRONSWORN.Progress', component: 'sf-progresses' },
      { titleKey: 'IRONSWORN.Connections', component: 'sf-connections' },
      { titleKey: 'IRONSWORN.Notes', component: 'sf-notes' },
    ]
    return {
      tabs,
      currentTab: tabs[0],
    }
  },

  methods: {
    burnMomentum() {
      this.$actor.burnMomentum()
    },

    rollStat(stat) {
      CONFIG.IRONSWORN.RollDialog.show({ actor: this.$actor, stat })
    },

    openCompendium(name) {
      const pack = game.packs?.get(`foundry-ironsworn.${name}`)
      pack?.render(true)
    },
  },
}
</script>
