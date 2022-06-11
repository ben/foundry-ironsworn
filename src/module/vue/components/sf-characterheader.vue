<template>
  <header class="sheet-header">
    <document-img :document="actor" size="75px" />

    <section class="character-vitals">
      <input type="text" :placeholder="$t('IRONSWORN.Name')" v-model="actor.name" ref="name" @blur="save" />
      <input
        type="text"
        :placeholder="$t('IRONSWORN.Pronouns')"
        :value="actor.data.pronouns"
        ref="pronouns"
        @blur="save"
      />
      <input
        type="text"
        :placeholder="$t('IRONSWORN.Callsign')"
        :value="actor.data.callsign"
        ref="callsign"
        @blur="save"
      />
    </section>

    <textarea
      rows="4"
      class="character-bio"
      :value="actor.data.biography"
      ref="characteristics"
      :placeholder="$t('IRONSWORN.Characteristics')"
      @blur="save"
    />
  </header>
</template>

<style lang="less">
@import '../../../styles/mixins.less';
.sheet-header {
  // display: flex;
  // flex-direction: row;
  // justify-content: flex-start;
  // height: 75px;
  // gap: 0.25rem;

  .doc-img {
    margin: 0;
  }
  .character-vitals {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    gap: 0.125rem;
    font-size: var(--font-size-14);
    input[type='text'] {
      flex-grow: 1;
    }
  }
  .character-bio {
    flex-grow: 2;
    resize: none;
    margin: 0;
    font-size: var(--font-size-14);
  }
}
</style>
<script>
export default {
  props: {
    actor: Object,
  },

  methods: {
    save() {
      this.$actor?.update({
        name: this.$refs.name.value,
        data: {
          callsign: this.$refs.callsign.value,
          pronouns: this.$refs.pronouns.value,
          biography: this.$refs.characteristics.value,
        },
      })
    },
  },
}
</script>
