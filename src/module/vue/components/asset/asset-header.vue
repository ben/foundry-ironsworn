<template>
  <header :class="$style['asset-header']" class="nogrow">
    <slot name="before-title">
      <!-- e.g. drag grip -->
    </slot>
    <slot name="title">
      <h4 :class="$style['asset-title']">
        {{ asset.name }}
      </h4>
    </slot>
    <slot name="type">
      <span :class="$style['asset-type']" aria-label="asset type">
        {{ asset.system.category }}
      </span>
    </slot>
    <slot name="controls"> </slot>
  </header>
</template>

<style lang="scss" module>
.asset-header {
  gap: var(--ironsworn-spacer-lg);
  align-items: center;
}

.asset-type {
  flex-grow: 0;
  transition: inherit;
  line-height: 1;
  color: var(--ironsworn-color-thematic);
  font-style: italic;
}

.asset-expand-toggle {
  display: flex;
  flex-flow: row wrap;
  gap: var(--ironsworn-spacer-lg);
  transition: var(--ironsworn-transition);
  box-shadow: none !important;
  background: none;
}

.asset-title {
  transition: inherit;
  margin: 0;
  text-transform: uppercase;
  line-height: 1;
  word-spacing: var(--ironsworn-word-spacing-sm);
  letter-spacing: var(--ironsworn-letter-spacing-sm);
  font-size: var(--font-size-14);
  font-weight: bold;
}

.asset-controls {
  display: flex;
  flex-grow: 0;
  flex-wrap: nowrap;
  justify-items: flex-end;
}
</style>

<script lang="ts" setup></script>
