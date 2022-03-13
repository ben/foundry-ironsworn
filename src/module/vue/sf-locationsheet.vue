<template>
  <div class="flexcol">
    <header class="sheet-header flexrow nogrow">
      <document-img :document="actor" size="82px" />
      <div class="flexcol">
        <div class="flexrow nogrow">
          <select
            style="margin-right: 5px"
            v-model="actor.data.subtype"
            @change="saveSubtype"
          >
            <option value="planet">Planet</option>
            <option value="settlement">Settlement</option>
            <option value="star">Stellar Object</option>
          </select>

          <div class="flexrow">
            <select v-model="actor.data.klass" @change="saveKlass">
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
          { value: '', label: '(Planet Class)' },
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
      return [] // TODO: settlements and stellar objects
    },
  },

  methods: {
    saveSubtype() {
      const subtype = this.actor.data.subtype
      this.$actor.update({ data: { subtype } })
    },
    saveKlass() {
      // TODO: update the image
      const klass = this.actor.data.klass
      this.$actor.update({ data: { klass } })
    },
    randomizeName() {},
    randomizeKlass() {},
  },
}
</script>
