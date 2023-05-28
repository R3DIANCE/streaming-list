<template>
  <PageHeader />
  <StreamerList />
</template>

<script>
import PageHeader from "./components/PageHeader.vue";
import StreamerList from "./components/StreamerList.vue";

export default {
    name: "App",
    components: {
        PageHeader,
        StreamerList,
    },
};
</script>

<style lang="scss">
@import "./assets/app.scss";
</style>
