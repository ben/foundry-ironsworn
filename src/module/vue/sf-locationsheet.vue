<template>
  <div class="flexcol">
    <header class="sheet-header flexrow nogrow">
      <document-img :document="actor" size="82px" style="margin-top: 5px" />
      <div class="flexcol">
        <div class="flexrow nogrow">
          <document-name
            :document="actor"
            :class="{ highlighted: firstLookHighlight }"
          />
          <div
            class="clickable block nogrow"
            :class="{ highlighted: firstLookHighlight }"
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
            <option value="derelict">Derelict</option>
            <option value="vault">Precursor Vault</option>
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

    <section class="boxgroup flexcol nogrow" v-if="oracles.length > 0">
      <div class="boxrow">
        <div
          class="clickable block box"
          @mouseenter="firstLookHighlight = true"
          @mouseleave="firstLookHighlight = false"
          @click="rollFirstLook"
        >
          <i class="fas fa-dice"></i>
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

    <section class="flexcol" style="margin-top: 1rem">
      <quill-editor v-model="actor.data.description" />
    </section>
  </div>
</template>

<style lang="less" scoped>
.box {
  padding: 7px;
}
.highlighted {
  background: #33999933;
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
  if (subtype === 'settlement') {
    return `systems/foundry-ironsworn/assets/locations/settlement-${klass.replace(
      /\s+/,
      ''
    )}.webp`
  }
  if (subtype === 'derelict') {
    return `systems/foundry-ironsworn/assets/locations/derelict-${klass.replace(
      /\s+/,
      ''
    )}.webp`
  }
  if (subtype === 'vault') {
    return `systems/foundry-ironsworn/assets/locations/vault-${klass.replace(
      /\s+/,
      ''
    )}.webp`
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
      switch (this.actor.data.subtype) {
        case 'planet':
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

        case 'settlement':
        case 'derelict':
        case 'vault':
          return [
            { value: 'planetside', label: 'Planetside' },
            { value: 'orbital', label: 'Orbital' },
            { value: 'deep space', label: 'Deep Space' },
          ]

        case 'star':
          return [
            { value: 'smoldering red star', label: 'Smoldering Red Star' },
            { value: 'glowing orange star', label: 'Glowing Orange Star' },
            { value: 'burning yellow star', label: 'Burning Yellow Star' },
            { value: 'blazing blue star', label: 'Blazing Blue Star' },
            {
              value: 'young star incubating in a molecular cloud',
              label: 'Young Star',
            },
            {
              value: 'white dwarf shining with spectral light',
              label: 'White Dwarf',
            },
            {
              value: 'corrupted star radiating with unnatural light',
              label: 'Corrupted Star',
            },
            {
              value: 'neutron star surrounded by intense magnetic fields',
              label: 'Neutron Star',
            },
            {
              value:
                'two stars in close orbit connected by fiery tendrils of energy',
              label: 'Binary Stars',
            },
            {
              value: 'black hole allows nothing to escape—not even light',
              label: 'Black Hole',
            },
            {
              value: 'hypergiant star generating turbulent solar winds',
              label: 'Hypergiant',
            },
            {
              value: 'artificial star constructed by a long-dead civilization',
              label: 'Artificial Star',
            },
            {
              value: 'unstable star showing signs of impending supernova',
              label: 'Unstable Star',
            },
          ]

        default:
          throw new Error('bad type yo')
      }
    },

    oracles() {
      const { subtype, klass } = this.actor.data
      const kc = klass
        .split(' ')
        .map((x) => capitalize(x))
        .join(' ')
      const rc = capitalize(this.region)
      switch (subtype) {
        case 'planet':
          return [
            [
              {
                title: 'Atmosphere',
                dfId: `Starforged/Oracles/Planets/${kc}/Atmosphere`,
                fl: true,
              },
              {
                title: 'From Space',
                qty: '1-2',
                dfId: `Starforged/Oracles/Planets/${kc}/Observed_From_Space`,
                fl: true,
              },
            ],
            [
              {
                title: 'Settlements',
                dfId: `Starforged/Oracles/Planets/${kc}/Settlements/${rc}`,
                fl: true,
              },
              { title: 'Life', dfId: `Starforged/Oracles/Planets/${kc}/Life` },
              {
                title: 'Planetside Feature',
                qty: '1-2',
                dfId: `Starforged/Oracles/Planets/${kc}/Feature`,
              },
            ],
            [
              {
                title: 'Peril (life)',
                dfId: `Starforged/Oracles/Planets/Peril/Lifebearing`,
              },
              {
                title: 'Peril (no life)',
                dfId: `Starforged/Oracles/Planets/Peril/Lifeless`,
              },
              {
                title: 'Opportunity (life)',
                dfId: `Starforged/Oracles/Planets/Opportunity/Lifebearing`,
              },
              {
                title: 'Opportunity (no life)',
                dfId: `Starforged/Oracles/Planets/Opportunity/Lifeless`,
              },
            ],
          ]

        case 'settlement':
          return [
            [
              {
                title: 'Population',
                dfId: `Starforged/Oracles/Settlements/Population/${rc}`,
                fl: true,
              },
              {
                title: 'First Look',
                dfId: 'Starforged/Oracles/Settlements/First_Look',
                qty: '1-2',
                fl: true,
              },
            ],
            [
              {
                title: 'Initial Contact',
                dfId: 'Starforged/Oracles/Settlements/Initial_Contact',
              },
              { title: 'Authority', dfId: 'Starforged/Oracles/Settlements/Authority' },
            ],
            [
              { title: 'Projects', dfId: 'Starforged/Oracles/Settlements/Projects' },
              { title: 'Trouble', dfId: 'Starforged/Oracles/Settlements/Trouble' },
            ],
          ]

        case 'star':
          return [] // TODO

        case 'derelict':
          return [
            [
              {
                title: 'Type',
                dfId: `Starforged/Oracles/Derelicts/Type/${kc}`,
                fl: true,
              },
              {
                title: 'Condition',
                dfId: `Starforged/Oracles/Derelicts/Condition`,
                fl: true,
              },
            ],
            [
              {
                title: 'Outer first look',
                dfId: `Starforged/Oracles/Derelicts/Outer_First_Look`,
                fl: true,
              },
              {
                title: 'Inner first look',
                dfId: `Starforged/Oracles/Derelicts/Inner_First_Look`,
              },
            ],
          ]

        case 'vault':
          return [
            [
              {
                title: 'Scale',
                dfId: `Starforged/Oracles/Vaults/Scale`,
                fl: true,
              },
              {
                title: 'Form',
                dfId: `Starforged/Oracles/Vaults/Form`,
                fl: true,
              },
              {
                title: 'Shape',
                dfId: `Starforged/Oracles/Vaults/Shape`,
                fl: true,
              },
            ],
            [
              {
                title: 'Material',
                dfId: `Starforged/Oracles/Vaults/Material`,
                fl: true,
              },
              {
                title: 'Outer First Look',
                dfId: `Starforged/Oracles/Vaults/Outer_First_Look`,
                fl: true,
              },
            ],
            [
              {
                title: 'Interior First Look',
                dfId: `Starforged/Oracles/Vaults/Interior/First_Look`,
              },
              {
                title: 'Interior Feature',
                dfId: `Starforged/Oracles/Vaults/Interior/Feature`,
              },
              {
                title: 'Interior Peril',
                dfId: `Starforged/Oracles/Vaults/Interior/Peril`,
              },
              {
                title: 'Interior Opportunity',
                dfId: `Starforged/Oracles/Vaults/Interior/Opportunity`,
              },
            ],
            [
              {
                title: 'Sanctum Purpose',
                dfId: `Starforged/Oracles/Vaults/Sanctum/Purpose`,
              },
              {
                title: 'Sanctum Feature',
                dfId: `Starforged/Oracles/Vaults/Sanctum/Feature`,
              },
              {
                title: 'Sanctum Peril',
                dfId: `Starforged/Oracles/Vaults/Sanctum/Peril`,
              },
              {
                title: 'Sanctum Opportunity',
                dfId: `Starforged/Oracles/Vaults/Sanctum/Opportunity`,
              },
            ],
          ]

        default:
          throw new Error('bad type yo')
      }
    },
  },

  watch: {
    'actor.data.description'() {
      this.$actor.update({ 'data.description': this.actor.data.description })
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
      const img = randomImage(subtype, this.actor.data.klass)
      await this.$actor.update({ data: { subtype } })

      const scale = {
        planet: 1,
        settlement: 2,
        star: 1,
        derelict: 2,
        vault: 2,
      }[subtype]
      await this.updateAllTokens({ img, scale })
    },
    async saveKlass(klass) {
      const { subtype } = this.actor.data
      const img = randomImage(subtype, klass)

      await this.$actor.update({ img, data: { klass } })
      await this.updateAllTokens({ img })
    },

    async randomizeName() {
      const { subtype, klass } = this.actor.data
      let name
      if (subtype === 'planet') {
        // no oracle for this
        const kc = capitalize(klass)
        const json = await CONFIG.IRONSWORN.dataforgedHelpers.getDFOracleByDfId(
          `Starforged/Oracles/Planets/${kc}`
        )
        name = CONFIG.IRONSWORN._.sample(json?.['Sample Names'] ?? [])
      } else if (subtype === 'settlement') {
        const table = await CONFIG.IRONSWORN.dataforgedHelpers.getFoundryTableByDfId(
          'Starforged/Oracles/Settlements/Name'
        )
        name = await CONFIG.IRONSWORN.rollAndDisplayOracleResult(table)
      }

      if (name) {
        await this.$actor.update({ name })
        await this.updateAllTokens({ name })
      }
    },

    async randomizeKlass() {
      let tableKey
      if (this.actor.data.subtype === 'planet') {
        tableKey = 'Oracles/Planets/Class'
      } else if (this.actor.data.subtype === 'settlement') {
        tableKey = 'Oracles/Settlements/Location'
      } else if (this.actor.data.subtype === 'star') {
        tableKey = 'Oracles/Space/Stellar Object'
      } else if (this.actor.data.subtype === 'derelict') {
        tableKey = 'Oracles/Derelicts/Location'
      } else if (this.actor.data.subtype === 'vault') {
        tableKey = 'Oracles/Vaults/Location'
      }

      const table = await CONFIG.IRONSWORN.dataforgedHelpers.getFoundryTableByDfId(tableKey)
      const rawText = await CONFIG.IRONSWORN.rollAndDisplayOracleResult(table)
      if (!rawText) return

      const lctext = rawText.toLowerCase()
      const option = this.klassOptions.find((x) => lctext.match(x.value))
      if (option) {
        await this.saveKlass(option.value)
      }
    },

    async rollFirstLook() {
      await this.randomizeKlass()
      await this.randomizeName()
      for (const oracle of flatten(this.oracles)) {
        if (oracle.fl) {
          await this.rollOracle(oracle)
        }
      }
    },
    async rollOracle(oracle) {
      const table = await CONFIG.IRONSWORN.dataforgedHelpers.getFoundryTableByDfId(oracle.dfId)
      const drawText = await CONFIG.IRONSWORN.rollAndDisplayOracleResult(table)
      if (!drawText) return

      // Append to description
      const parts = [
        this.actor.data.description,
        '<p><strong>',
        oracle.title,
        ':</strong> ',
        drawText,
        '</p>',
      ]
      await this.$actor.update({ data: { description: parts.join('') } })
    },

    async updateAllTokens(data) {
      // Prototype token
      await this.$actor.data.token.update(data)

      // All tokens in the scene
      const activeTokens = this.$actor.getActiveTokens()
      const updates = activeTokens.map((at) => ({
        _id: at.data._id,
        ...data,
      }))
      await canvas.scene?.updateEmbeddedDocuments('Token', updates)
    },
  },
}
</script>
