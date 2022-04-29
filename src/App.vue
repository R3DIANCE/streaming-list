<script setup>
import { RouterView } from "vue-router";
console.log(import.meta.env.VITE_TWITCH_SEARCH_SERVER);
</script>

<template>
  <RouterView />
</template>

<style>
    @import './assets/app.css';
    @import './assets/font-awesome.css';
</style>
