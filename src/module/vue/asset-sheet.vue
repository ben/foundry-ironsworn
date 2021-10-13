<template>
  <div class="flexcol">
    <h2>Asset {{ item.name }}</h2>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
}
</script>
