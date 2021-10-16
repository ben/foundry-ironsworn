<template>
  <img
    :src="document.img"
    :title="document.name"
    class="profile-img"
    data-edit="img"
    height="50"
    width="50"
  />
</template>

<script>
export default {
  props: {
    document: Object
  }
}
</script>
