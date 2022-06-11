<!-- wrapper for consistent rendering of foundry items presented in a list; used in e.g. character sheet pages for progress and assets -->
<!-- use with foundry-item-list -->
<template>
  <li class="foundry-item">
    <slot></slot>
  </li>
</template>

<style lang="less">
.foundry-item {
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  border: 1px solid var(--color-bg-alt);
  border-radius: 0.25rem;
  padding: 0.5rem;
  & > *:not(.item-order-controls) {
    flex-grow: 1;
  }
}
</style>
