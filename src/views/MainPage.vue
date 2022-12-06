<template>
    <PageHeader :viewers="viewers" :online_count="online_count" />
    <StreamerList @total-viewers="set_viewers" @streamers="set_streamers" />
</template>

<script>
import PageHeader from "../components/PageHeader.vue"
import StreamerList from "../components/StreamerList.vue"
export default {
    name: "MainPage",
    props: {},
    data() {
        return {
            viewers: 0,
            online_count: 0,
        }
    },
    components: {
        PageHeader,
        StreamerList,
    },
    created() {},
    methods: {
        set_viewers(viewers) {
            this.viewers = viewers
        },
        set_streamers(streamers) {
            this.online_count = streamers
        },
    },
}
</script>

<style lang="scss">
@import "../assets/app.scss";
</style>
