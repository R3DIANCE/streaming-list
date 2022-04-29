<template>
    <Header :viewers="viewers" :online_count="online_count" />
    <Streamerlist @total-viewers="set_viewers" @streamers="set_streamers" @observe="observe_images" />
</template>

<script>
    import lozad from 'lozad';
    import Header from '../components/Header.vue';
    import Streamerlist from '../components/Streamers.vue';
    export default {
        name: "Main",
        props: {},
        data() {
            return {
                viewers: 0,
                online_count: 0,
                observer: null
            }
        },
        components: {
            Header,
            Streamerlist
        },
        created() {
            const observer = lozad();
            this.observer = observer;
            this.observer.enableAutoReload = true;
            this.observer.observe();
        },
        methods: {
            set_viewers(viewers) {
                this.viewers = viewers;
            },
            set_streamers(streamers) {
                this.online_count = streamers;
            },
            observe_images() {
                this.observer.observe();
            }
        },
        beforeDestroy() {
            this.observer.disconnect();
        }
    }
</script>