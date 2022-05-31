<template>
  <article class="page-legacies">
    <legacy-track propKey="quests" :title="$t('IRONSWORN.Quests')" :actor="actor" />
    <legacy-track propKey="bonds" :title="$t('IRONSWORN.Bonds')" :actor="actor" />
    <legacy-track propKey="discoveries" :title="$t('IRONSWORN.Discoveries')" :actor="actor" />

    <hr class="nogrow" v-if="starredProgresses.length > 0" />
    <progress-tracker v-for="item in starredProgresses" :key="item._id" :item="item" :actor="actor" />
  </article>
</template>

<style lang="less">
.page-legacies {
  display: flex;
  flex-flow: column nowrap;
  gap: 1em;
}
</style>

<script>
export default {
  props: {
    actor: Object,
  },

  computed: {
    starredProgresses() {
      return this.actor.items.filter((x) => x.type === 'progress').filter((x) => x.data.starred)
    },
  },
}
</script>
