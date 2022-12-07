<template>
    <PageHeader :viewer_count="viewer_count" :streamer_count="streamer_count" />
    <StreamerList @set_viewer_count="set_viewer_count" @set_streamer_count="set_streamer_count" />
</template>

<script>
import { ref } from "vue"
import PageHeader from "./components/PageHeader.vue"
import StreamerList from "./components/StreamerList.vue"

export default {
    name: "App",
    setup() {
        const viewer_count = ref(0);
        const streamer_count = ref(0);

        return {
            viewer_count,
            streamer_count
        }
    },
    components: {
        PageHeader,
        StreamerList,
    },
    methods: {
        set_viewer_count(viewer_count) {
            this.viewer_count = viewer_count;
        },
        set_streamer_count(streamer_count) {
            this.streamer_count = streamer_count;
        },
    },
}
</script>

<style lang="scss">
@import "./assets/app.scss";
</style>
