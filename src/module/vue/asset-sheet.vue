<template>
  <div class="flexcol">
    <header class="sheet-header nogrow">
      <h1 class="charname">
        <input type="text" v-model="item.name" />
      </h1>
    </header>

    <p class="nogrow">
      <input v-if="editMode" type="text" v-model="item.data.description" />
      <span v-else>{{ item.data.description }}</span>
    </p>

    <h3 class="nogrow">{{ $t('IRONSWORN.Fields') }}</h3>
    <div class="boxgroup nogrow">
      <div
        class="flexrow boxrow nogrow fieldrow"
        v-for="(field, i) in item.data.fields"
        :key="i"
      >
        <div class="box flexrow" style="align-items: center">
          <input v-if="editMode" type="text" v-model="field.name" />
          <p v-else>{{ field.name }}</p>
        </div>
        <div class="box flexrow">
          <input type="text" v-model="field.value" />
        </div>
        <div v-if="editMode" class="box flexrow nogrow">
          <icon-button icon="trash" @click="deleteField(i)" />
        </div>
      </div>
      <div class="flexrow boxrow nogrow">
        <div
          class="box clickable block"
          @click="addField"
          style="min-height: 1.5rem; align-items: center"
        >
          <i class="fas fa-plus" />
        </div>
      </div>
    </div>

    <h3 class="nogrow">{{ $t('IRONSWORN.Abilities') }}</h3>
    <div class="flexrow" v-for="(ability, i) in item.data.abilities" :key="i">
      <input
        type="checkbox"
        :checked="ability.enabled"
        @change="markAbility(i)"
      />
      <input v-if="editMode" type="text" v-model="ability.description" />
      <div v-else v-html="$enrichHtml(ability.description)" />
    </div>

    <h3 class="nogrow">{{ $t('IRONSWORN.Options') }}</h3>
    <div class="boxgroup nogrow">
      <div
        class="flexrow boxrow fieldrow"
        v-for="(option, i) in item.data.exclusiveOptions"
        :key="i"
      >
        <div class="box">
          <input
            type="checkbox"
            class="nogrow"
            :checked="option.selected"
            @change="markOption(i)"
          />
          <input type="text" v-if="editMode" v-model="option.name" />
          <p v-else>{{ option.name }}</p>
        </div>
      </div>
    </div>
    <div
      class="flexrow"
      v-for="(option, i) in item.data.exclusiveOptions"
      :key="i"
    ></div>
  </div>
</template>

<style lang="less" scoped>
.fieldrow {
  p,
  input {
    text-align: left;
    padding: 0 0.5em;
    margin: 3px;
  }
}
h3 {
  margin-top: 1em;
}
</style>

<script>
export default {
  props: {
    item: Object,
  },

  computed: {
    editMode() {
      return this.item.flags['foundry-ironsworn']?.['edit-mode']
    },
  },

  watch: {
    'item.name': CONFIG.IRONSWORN._.debounce(function () {
      this.$item().update({ name: this.item.name })
    }, 1000),

    'item.data.description': CONFIG.IRONSWORN._.debounce(function () {
      this.$item().update({ data: { description: this.item.data.description } })
    }, 1000),

    'item.data.fields': {
      deep: true,
      handler: CONFIG.IRONSWORN._.debounce(function () {
        if (
          !CONFIG.IRONSWORN._.isEqual(
            this.item.data.fields,
            this.$item().data.data.fields
          )
        ) {
          const fields = Object.values(this.item.data.fields)
          this.$item().update({ data: { fields } })
        }
      }, 1000),
    },

    'item.data.abilities': {
      deep: true,
      handler: CONFIG.IRONSWORN._.debounce(function () {
        if (
          !CONFIG.IRONSWORN._.isEqual(
            this.item.data.abilities,
            this.$item().data.data.abilities
          )
        ) {
          const abilities = Object.values(this.item.data.abilities)
          this.$item().update({ data: { abilities } })
        }
      }, 1000),
    },

    'item.data.exclusiveOptions': {
      deep: true,
      handler: CONFIG.IRONSWORN._.debounce(function () {
        if (
          !CONFIG.IRONSWORN._.isEqual(
            this.item.data.exclusiveOptions,
            this.$item().data.data.exclusiveOptions
          )
        ) {
          const exclusiveOptions = Object.values(
            this.item.data.exclusiveOptions
          )
          this.$item().update({ data: { exclusiveOptions } })
        }
      }, 1000),
    },
  },

  methods: {
    addField() {
      const fields = Object.values(this.item.data.fields)
      fields.push({ name: ' ', value: ' ' })
      this.$item().update({ data: { fields } })
    },

    deleteField(idx) {
      const fields = Object.values(this.item.data.fields)
      fields.splice(idx, 1)
      this.$item().update({ data: { fields } })
    },

    markAbility(idx) {
      const abilities = Object.values(this.item.data.abilities)
      abilities[idx] = { ...abilities[idx], enabled: !abilities[idx].enabled }
      this.$item().update({ data: { abilities } })
    },

    markOption(idx) {
      const exclusiveOptions = Object.values(this.item.data.exclusiveOptions)

      for (let i = 0; i < exclusiveOptions.length; i++) {
        exclusiveOptions[i] = {
          ...exclusiveOptions[i],
          selected: i === idx,
        }
      }
      this.$item().update({ data: { exclusiveOptions } })
    },
  },
}
</script>
