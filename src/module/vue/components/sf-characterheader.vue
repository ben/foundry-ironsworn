<template>
  <header class="sheet-header flexrow">
    <document-img :document="actor" size="75px" />

    <div class="flexcol" style="flex-basis: 100px">
      <input
        type="text"
        style="margin-bottom: 5px"
        :placeholder="$t('IRONSWORN.Name')"
        v-model="actor.name"
      />
      <input
        type="text"
        style="margin-bottom: 5px"
        :placeholder="$t('IRONSWORN.Pronouns')"
        v-model="actor.data.pronouns"
      />
      <input
        type="text"
        :placeholder="$t('IRONSWORN.Callsign')"
        v-model="actor.data.callsign"
      />
    </div>

    <textarea
      rows="4"
      v-model="actor.data.biography"
      style="flex-basis: 300px; margin-left: 6px;"
      :placeholder="$t('IRONSWORN.Characteristics')"
    />
  </header>
</template>

<style lang="less" scoped>
// header input {
//   margin-bottom: 4px;
// }

// header input:last {
//   margin-bottom: 0;
// }
</style>

<script>
export default {
  props: {
    actor: Object,
  },
}
</script>
