<!-- wrapper for consistent rendering of foundry items presented in a list; used in e.g. character sheet pages for progress and assets -->
<!-- use with foundry-item-list -->
<template>
  <li class="foundry-item">
    <slot></slot>
  </li>
</template>

<style lang="less">
.foundry-item {
  flex-grow: 0;
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  border: 1px solid lightgrey;
  border-radius: 0.25rem;
  padding: 0.5rem;
}
</style>
