<template>
  <ul :class="$style.wrapper">
    <slot name="default"></slot>
  </ul>
</template>

<style lang="scss" module>
.wrapper {
  --ironsworn-item-list-size: 100px;
  --ironsworn-item-line-height: 24px;
  --ironsworn-item-height: 30px;

  display: flex;
  flex: 1 0 var(--ironsworn-item-list-size);
  flex-direction: column;
  margin: 0;
  padding-left: 0;
  list-style: none;

  .item {
    border-bottom: var(--ironsworn-border-width-md) solid
      var(--ironsworn-color-border);
    padding: var(--ironsworn-spacer-sm) 0;

    // FIXME: what's this for?
    height: var(--ironsworn-item-height);
    line-height: var(--ironsworn-item-line-height);

    img {
      flex: 0 0 var(--ironsworn-item-line-height);
      margin-right: var(--ironsworn-spacer-md);
    }
  }

  ol {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      border-color: var(--ironsworn-color-border);
    }

    & > h2 {
      border-width: var(--ironsworn-border-width-md) 0;
      text-align: center;
    }
  }
}
</style>

<script lang="ts" setup></script>
