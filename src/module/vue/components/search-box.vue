<template>
  <nav :class="$style.searchBox">
    <slot name="before"></slot>
    <input
      type="search"
      :class="$style.searchInput"
      @search="$emit"
      name="q"
      autocorrect="off"
      spellcheck="false"
      incremental
      @submit.prevent
    />
    <section :class="$style.searchBoxControls">
      <!-- may be possible to omit -- needs testing -->
      <!-- <BtnFaicon
        icon="times-circle"
        class="nogrow clickable text"
        @click="clearSearch()"
        :class="$style.searchBtn"
      /> -->
      <slot name="controls"></slot>
    </section>
    <slot name="after"></slot>
  </nav>
</template>

<style lang="less" module>
.searchBox {
}
.searchInput {
}
.searchBoxControls {
}
</style>

<script lang="ts" setup>
import BtnFaicon from './buttons/btn-faicon.vue'

// consider: inject search query + a function to clear search?
// is skipping the clear search button worthwhile here, since the native ui may provide it anyways?

const $emit = defineEmits(['search'])
</script>
