<template>
  <div class="flexcol">
    <header class="sheet-header flexrow nogrow">
      <document-img :document="actor" size="82px" />
      <div class="flexcol">
        <div class="flexrow nogrow">
          <select
            style="margin-right: 5px; flex-basis: 150px"
            v-model="actor.data.subtype"
            @change="subtypeChanged"
          >
            <option value="planet">Planet</option>
            <option value="settlement">Settlement</option>
            <option value="star">Stellar Object</option>
          </select>

          <div class="flexrow" style="flex-basis: 200px">
            <select v-model="actor.data.klass" @change="klassChanged">
              <option
                v-for="opt in klassOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
            <div
              class="clickable block nogrow"
              style="margin-left: 5px; padding: 5px"
              @click="randomizeKlass"
            >
              <i class="fa fa-dice-d6" />
            </div>
          </div>
        </div>

        <div class="flexrow nogrow">
          <document-name :document="actor" />
          <div
            class="clickable block disabled nogrow"
            style="
              margin: 5px 0px;
              padding: 0 5px;
              line-height: 50px;
              margin-left: 5px;
            "
            @click="randomizeName"
          >
            <i class="fa fa-dice-d6" />
          </div>
        </div>
      </div>
    </header>

    <section class="nogrow">
      <div class="boxgroup boxrow"></div>
    </section>

    <!-- if planet -->
    <button>settlements</button>
    <!-- "create" button at right, auto triggered when rolled -->

    <button>Observed</button>
    <button>Planetside</button>
    <button>Life</button>

    <editor
      target="data.description"
      :owner="true"
      :button="true"
      :editable="true"
      :content="actor.data.description"
    />
  </div>
</template>

<script>
import { capitalize } from 'lodash'
function randomImage(subtype, klass) {
  if (subtype === 'planet') {
    const name = capitalize(klass)
    const i = Math.floor(Math.random() * 2) + 1
    return `systems/foundry-ironsworn/assets/planets/Starforged-Planet-Token-${name}-0${i}.webp`
  }
}

export default {
  props: {
    actor: Object,
  },

  data() {
    return {}
  },

  computed: {
    klassOptions() {
      if (this.actor.data.subtype === 'planet') {
        return [
          { value: 'desert', label: 'Desert World' },
          { value: 'furnace', label: 'Furnace World' },
          { value: 'grave', label: 'Grave World' },
          { value: 'ice', label: 'Ice World' },
          { value: 'jovian', label: 'Jovian World' },
          { value: 'jungle', label: 'Jungle World' },
          { value: 'ocean', label: 'Ocean World' },
          { value: 'rocky', label: 'Rocky World' },
          { value: 'shattered', label: 'Shattered World' },
          { value: 'tainted', label: 'Tainted World' },
          { value: 'vital', label: 'Vital World' },
        ]
      }
      if (this.actor.data.subtype === 'settlement') {
        return [
          { value: 'planetside', label: 'Planetside' },
          { value: 'orbital', label: 'Orbital' },
          { value: 'deepspace', label: 'Deep Space' },
        ]
      }
      return [
        { value: 'smoldering', label: 'Smoldering Red Star' },
        { value: 'glowing', label: 'Glowing Orange Star' },
        { value: 'burning', label: 'Burning Yellow Star' },
        { value: 'blazing', label: 'Blazing Blue Star' },
        { value: 'young', label: 'Young Star' },
        { value: 'whitedwarf', label: 'White Dwarf' },
        { value: 'corrupted', label: 'Corrupted Star' },
        { value: 'neutron', label: 'Neutron Star' },
        { value: 'double', label: 'Binary Stars' },
        { value: 'blackhole', label: 'Black Hole' },
        { value: 'artificial', label: 'Artificial Star' },
        { value: 'unstable', label: 'Unstable Star' },
      ]
    },
  },

  methods: {
    subtypeChanged(evt) {
      this.saveSubtype(evt.target.value)
    },
    klassChanged(evt) {
      this.saveKlass(evt.target.value)
    },

    saveSubtype(subtype) {
      this.$actor.update({ data: { subtype } })
    },
    saveKlass(klass) {
      const { subtype } = this.actor.data
      const img = randomImage(subtype, klass)

      this.$actor.update({ img, data: { klass } })
      // TODO: update prototype and all linked tokens
    },

    async randomizeName() {
      // no oracle for this
      const klass = capitalize(this.actor.data.klass)
      const table = await CONFIG.IRONSWORN.sfOracleByDataforgedId(
        `Oracles / Planets / ${this.actor} / Name`
      )
    },
    async randomizeKlass() {
      const table = await CONFIG.IRONSWORN.sfOracleByDataforgedId(
        'Oracles / Planets / Class'
      )
      const result = await table?.draw()
      const rawText = result?.results[0]?.data.text
      if (!rawText) return

      const lctext = rawText.toLowerCase()
      const option = this.klassOptions.find((x) => lctext.match(x.value))
      if (option) {
        this.saveKlass(option.value)
      }
    },
  },
}
</script>
