<template>
  <PageHeader
    :viewer-count="viewerCount"
    :streamer-count="streamerCount"
  />
  <StreamerList
    @set_viewer_count="set_viewer_count"
    @set_streamer_count="set_streamer_count"
  />
</template>

<script>
import { ref } from "vue";
import PageHeader from "./components/PageHeader.vue";
import StreamerList from "./components/StreamerList.vue";

export default {
    name: "App",
    components: {
        PageHeader,
        StreamerList,
    },
    setup() {
        const viewerCount = ref(0);
        const streamerCount = ref(0);

        return {
            viewerCount,
            streamerCount
        };
    },
    methods: {
        set_viewer_count(viewerCount) {
            this.viewerCount = viewerCount;
        },
        set_streamer_count(streamerCount) {
            this.streamerCount = streamerCount;
        },
    },
};
</script>

<style lang="scss">
@import "./assets/app.scss";
</style>
