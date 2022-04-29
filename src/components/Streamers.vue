<template>
    <ul class="cards">
        <Streamer :stream=stream  :key="stream.user_id" v-for="stream in streamers" />
    </ul>
</template>

<script>
    import Streamer from './Streamer.vue';

    export default {
        name: "Streamers",
        props: {},
        components: {
            Streamer
        },
        data() {
            return {
                "streamers": [],
                "views": 0,
                "search_server": ""
            }
        },
        async created() {
            let twitch_data = await this.fetch_twitch();
            this.streamers = twitch_data;
            let viewers = 0;
            let streamers = 0;
            twitch_data.forEach(stream => {
                viewers = viewers + stream["viewer_count"];
                streamers = streamers + 1;
            });
            this.set_total_views(viewers);
            this.set_streamers(streamers);
        },
        methods: {
            async fetch_twitch() {
                const response = await fetch(import.meta.env.VITE_TWITCH_SEARCH_SERVER);
                const api_data = await response.json();

                if (api_data["status"] == "done") {
                    return api_data["data"]
                }
            },
            set_total_views(viewers) {
                this.$emit("total-viewers", viewers);
            },
            set_streamers(streamers) {
                this.$emit("streamers", streamers);
            }
        }
    }
</script>

<style scoped>
    @import '../assets/streamers.css';
</style>