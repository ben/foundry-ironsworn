<template>
	<Loading :active="true" loader="bars" :is-full-page="false" />
</template>

<script lang="ts" setup>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
</script>
