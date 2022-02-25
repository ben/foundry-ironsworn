<template>
  <h4>
    {{ oracle.title }} — {{ oracle.key }}
  </h4>
</template>

<script>
export default {
  props: {
    oracle: Object
  }
}
</script>
