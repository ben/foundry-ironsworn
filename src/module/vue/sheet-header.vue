<template>
  <header class="sheet-header">
    <slot></slot>
  </header>
</template>
<script lang="ts" setup>
/**
 * Wrapper to standardize + encapsulate sheet header styles.
 */
</script>
<style lang="scss">
// not scoped, so it also applies to handlebars templates with the appropriate class
.sheet-header {
  display: flex;
  flex-direction: row;
  gap: 6px;

  .profile-img {
    flex: 0 0 50px;
    margin-right: var(--ironsworn-spacer-xl);
    height: 50px;
  }

  .header-fields {
    flex: 1;
    height: 100px;
  }

  h1.charname {
    flex-grow: 1;
    margin: 0;
    border-bottom: 0;
    padding: 0;
    height: 50px;

    input {
      margin: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
