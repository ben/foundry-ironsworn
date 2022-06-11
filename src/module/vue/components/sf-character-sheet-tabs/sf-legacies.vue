<template>
  <itemlist-page class="legacies-page">
    <transition-group name="slide" tag="foundryitem-list" class="legacy-tracks">
      <foundry-listitem v-for="legacy in legacyData" :key="legacy.propKey" :class="legacy.propKey">
        <legacy-track :propKey="legacy.propKey" :title="$t(`IRONSWORN.${legacy.i18n}`)" :actor="actor" />
      </foundry-listitem>
    </transition-group>

    <transition-group
      v-if="starredProgresses.length > 0"
      name="slide"
      tag="foundryitem-list"
      class="progress-tracks starred-progress"
      data-drop-type="progress"
    >
      <foundry-listitem class="item-progress" v-for="item in starredProgresses" :key="item._id">
        <progress-tracker challengeRankSvg="hex-pip" :item="item" :actor="actor" />
      </foundry-listitem>
    </transition-group>
  </itemlist-page>
</template>

<style lang="less">
.legacies-page {
  @import '../../../../styles/brand-colors.less';
  .legacy-tracks {
    .quests {
      --theme-color: @legacy-quests;
    }
    .bonds {
      --theme-color: @legacy-bonds;
    }
    .discoveries {
      --theme-color: @legacy-discoveries;
    }
    .foundry-item {
      border-color: var(--theme-color);
      border-width: 2px;
    }
  }

  ul.starred-progress {
    border-top: 1px solid;
    padding-top: 0.5rem;
  }
}
</style>

<script>
const legacyData = [
  { propKey: 'quests', i18n: 'Quests' },
  { propKey: 'bonds', i18n: 'Bonds' },
  { propKey: 'discoveries', i18n: 'Discoveries' },
]
export default {
  props: {
    actor: Object,
    legacies: legacyData,
  },
  data() {
    return { legacyData }
  },
  computed: {
    starredProgresses() {
      return this.actor.items.filter((x) => x.type === 'progress').filter((x) => x.data.starred)
    },
  },
}
</script>
