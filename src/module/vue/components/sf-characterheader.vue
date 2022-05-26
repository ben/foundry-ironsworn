<template>
  <header class="sheet-header flexrow">
    <document-img :document="actor" size="75px" />

    <section class="character-vitals flexcol">
      <input
        type="text"
        :placeholder="$t('IRONSWORN.Name')"
        v-model="actor.name"
        ref="name"
        @blur="save"
      />
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
