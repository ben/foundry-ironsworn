<!-- wrapper for consistent rendering of foundry items presented in a list; used in e.g. character sheet pages for progress and assets -->
<!-- use with foundry-item -->
<template>
  <ul class="foundry-item-list">
    <slot></slot>
  </ul>
</template>

<style lang="less">
.foundry-item-list {
  padding: 0;
  margin: 0;
  gap: 0.5rem;
  display: flex;
  flex-flow: column nowrap;
}
</style>
