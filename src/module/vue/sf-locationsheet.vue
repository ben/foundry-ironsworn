<template>
  <div class="flexcol">
    <header class="sheet-header flexrow nogrow">
      <document-img :document="actor" size="82px" style="margin-top: 5px" />
      <div class="flexcol">
        <div class="flexrow nogrow">
          <document-name :document="actor" />
          <div
            class="clickable block nogrow"
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

        <div class="flexrow nogrow">
          <!-- Region -->
          <select v-model="region" style="margin-right: 5px; flex-basis: 150px">
            <option value="terminus">
              {{ $t('IRONSWORN.Terminus') }}
            </option>
            <option value="outlands">
              {{ $t('IRONSWORN.Outlands') }}
            </option>
            <option value="expanse">
              {{ $t('IRONSWORN.Expanse') }}
            </option>
          </select>

          <!-- Subtype -->
          <select
            style="margin-right: 5px; flex-basis: 150px"
            v-model="actor.data.subtype"
            @change="subtypeChanged"
          >
            <option value="planet">Planet</option>
            <option value="settlement">Settlement</option>
            <option value="star">Stellar Object</option>
          </select>

          <!-- Klass -->
          <div class="flexrow" style="flex-basis: 200px">
            <select
              v-model="actor.data.klass"
              @change="klassChanged"
              :class="{ highlighted: firstLookHighlight }"
            >
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
      </div>
    </header>

    <section
      class="boxgroup flexcol nogrow"
      v-if="actor.data.subtype === 'planet'"
    >
      <div class="boxrow">
        <div
          class="clickable block box"
          @mouseenter="firstLookHighlight = true"
          @mouseleave="firstLookHighlight = false"
          @click="rollFirstLook"
        >
          <i class="fas fa-eye"></i> &nbsp; First look
        </div>
      </div>
      <div class="flexrow boxrow" v-for="(row, i) of oracles" :key="`row${i}`">
        <div
          class="clickable block box"
          v-for="oracle of row"
          :class="{ highlighted: oracle.fl && firstLookHighlight }"
          :key="oracle.dfId"
          @click="rollOracle(oracle)"
        >
          {{ oracle.title }} <span v-if="oracle.qty">({{ oracle.qty }})</span>
        </div>
      </div>
    </section>

    <section>
      <editor
        target="data.description"
        :owner="true"
        :button="true"
        :editable="true"
        :content="actor.data.description"
      />
    </section>
  </div>
</template>

<style lang="less" scoped>
.box {
  padding: 7px;
}
.highlighted {
  background: lightyellow;
}
</style>

<script>
import { capitalize, flatten } from 'lodash'

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
    const sceneId = game.user.viewedScene
    const scene = game.scenes.get(sceneId)
    const region = scene.getFlag('foundry-ironsworn', 'region') || 'terminus'
    return {
      region,
      firstLookHighlight: false,
    }
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

    oracles() {
      const { subtype, klass } = this.actor.data
      const kc = capitalize(klass)
      const rc = capitalize(this.region)
      if (subtype === 'planet') {
        return [
          [
            {
              title: 'Atmosphere',
              dfId: `Oracles / Planets / ${kc} / Atmosphere`,
              fl: true,
            },
            {
              title: 'From Space',
              qty: '1-2',
              dfId: `Oracles / Planets / ${kc} / Observed From Space`,
              fl: true,
            },
          ],
          [
            {
              title: 'Settlements',
              dfId: `Oracles / Planets / ${kc} / Settlements / ${rc}`,
              fl: true,
            },
            { title: 'Life', dfId: `Oracles / Planets / ${kc} / Life` },
            {
              title: 'Planetside Feature',
              qty: '1-2',
              dfId: `Oracles / Planets / ${kc} / Feature`,
            },
          ],
          [
            {
              title: 'Peril (life)',
              dfId: `Oracles / Planets / Peril / Lifebearing`,
            },
            {
              title: 'Peril (no life)',
              dfId: `Oracles / Planets / Peril / Lifeless`,
            },
            {
              title: 'Opportunity (life)',
              dfId: `Oracles / Planets / Opportunity / Lifebearing`,
            },
            {
              title: 'Opportunity (no life)',
              dfId: `Oracles / Planets / Opportunity / Lifeless`,
            },
          ],
        ]
      }
    },
  },

  methods: {
    subtypeChanged(evt) {
      this.saveSubtype(evt.target.value)
    },
    klassChanged(evt) {
      this.saveKlass(evt.target.value)
    },

    async saveSubtype(subtype) {
      await this.$actor.update({ data: { subtype } })
    },
    async saveKlass(klass) {
      const { subtype } = this.actor.data
      const img = randomImage(subtype, klass)

      await this.$actor.update({ img, data: { klass } })
      // TODO: update prototype and all linked tokens
    },

    async randomizeName() {
      // no oracle for this
      const klass = capitalize(this.actor.data.klass)
      const json = await CONFIG.IRONSWORN.sfOracleJsonByDataforgedId(
        `Oracles / Planets / ${klass}`
      )
      const name = CONFIG.IRONSWORN._.sample(json?.['Sample Names'] ?? [])
      console.log(name)
      this.$actor.update({ name })
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
        await this.saveKlass(option.value)
      }
    },

    async rollFirstLook() {
      console.log('first look!')
      await this.randomizeKlass()
      for (const oracle of flatten(this.oracles)) {
        if (oracle.fl) {
          await this.rollOracle(oracle)
          // await new Promise((r) => setTimeout(r, 10))
        }
      }
    },
    async rollOracle(oracle) {
      const table = await CONFIG.IRONSWORN.sfOracleByDataforgedId(oracle.dfId)
      const drawResult = await table?.draw()
      const drawText = drawResult?.results[0]?.data.text
      if (!drawText) return

      // Append to description
      const description = `${this.actor.data.description}\n<p><strong>${oracle.title}:</strong> ${drawText}</p>`
      await this.$actor.update({ data: { description } })
    },
  },
}
</script>
