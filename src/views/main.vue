<template>
    <Header :viewers="viewers" :online_count="streamers" />
    <Streamers @total-viewers="set_viewers" @streamers="set_streamers" />
</template>

<script>
    import Header from '../components/Header.vue';
    import Streamers from '../components/Streamers.vue';
    export default {
        name: "Main",
        props: {},
        data() {
            return {
                "viewers": 0
            }
        },
        components: {
            Header,
            Streamers
        },
        methods: {
            set_viewers(viewers) {
                this.viewers = viewers;
            },
            set_streamers(streamers) {
                this.streamers = streamers;
            }
        }
    }
</script>