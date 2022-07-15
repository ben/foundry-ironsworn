<template>
  <div class="nogrow">
    <stack-box
      v-for="x in values"
      :key="x"
      :stat="stat"
      :value="x"
      :softMax="softMax"
    >
    </stack-box>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import stackBox from './stack-box.vue'

export default defineComponent({
  components: { stackBox },
  props: {
    stat: String,
    top: Number,
    bottom: Number,
    softMax: Number,
  },
  computed: {
    values() {
      const ret = []
      const increment = this.top > this.bottom ? -1 : 1
      let value = this.top
      do {
        const valueStr = value > 0 ? `+${value}` : value.toString()
        ret.push(value)
        value += increment
      } while (value != this.bottom + increment)
      return ret
    },
  },
})
</script>
