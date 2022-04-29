<template>
    <Header :viewers="viewers" :online_count="online_count" />
    <Streamerlist @total-viewers="set_viewers" @streamers="set_streamers" />
</template>

<script>
    import Header from '../components/Header.vue';
    import Streamerlist from '../components/Streamers.vue';
    export default {
        name: "Main",
        props: {},
        data() {
            return {
                "viewers": 0,
                "online_count": 0
            }
        },
        components: {
            Header,
            Streamerlist
        },
        methods: {
            set_viewers(viewers) {
                this.viewers = viewers;
            },
            set_streamers(streamers) {
                this.online_count = streamers;
            }
        }
    }
</script>