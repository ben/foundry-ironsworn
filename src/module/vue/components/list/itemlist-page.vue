<!-- wrapper for character sheet pages whose primary content is a list of foundry items -->
<template>
  <article class="item-list-page">
    <slot></slot>
  </article>
</template>

<style lang="less">
.item-list-page {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
}
</style>
