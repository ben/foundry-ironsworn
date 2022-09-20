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
<style lang="less">
// not scoped, so it also applies to handlebars templates with the appropriate class
.sheet-header {
  display: flex;
  flex-direction: row;
  gap: 6px;

  .profile-img {
    flex: 0 0 50px;
    height: 50px;
    margin-right: 10px;
  }
  .header-fields {
    flex: 1;
    height: 100px;
  }

  h1.charname {
    flex-grow: 1;
    height: 50px;
    padding: 0px;
    border-bottom: 0;
    margin: 0;

    input {
      width: 100%;
      height: 100%;
      margin: 0;
    }
  }
}
</style>
