<template>
    <ul class="cards">
        <Streamer :stream=stream :key="stream['user_id']" v-for="stream in this.streamers" />
    </ul>
</template>

<script>
    import Streamer from './Streamer.vue';

    export default {
        name: "Streamerlist",
        props: {},
        components: {
            Streamer
        },
        data() {
            return {
                streamers: [],
                views: 0,
                search_server: "",
                timer: null
            }
        },
        async created() {
            let invalid_date = new Date(localStorage.getItem("streamers:invalidate"))
            let now = new Date();

            if (localStorage.getItem("streamers") && now < invalid_date) {
                // use old data
                console.log("using cached data: twitch");
                this.streamers = JSON.parse(localStorage.getItem("streamers"));
            } else {
                // get new data
                console.log("fetching new data: twitch");
                let twitch_data = await this.fetch_twitch();
                if (twitch_data != undefined) {
                    localStorage.setItem("streamers", JSON.stringify(twitch_data));
                    let invalid_date = new Date();
                    invalid_date.setMinutes(invalid_date.getMinutes() + 5);
                    localStorage.setItem("streamers:invalidate", invalid_date);
                    this.streamers = twitch_data;
                }
            }
            
            let viewers = 0;
            let streamers = 0;
            this.streamers.forEach(stream => {
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
        },
        mounted: function () {
            if (this.timer == null) {
                this.timer = setInterval(() => {
                    this.fetch_twitch()
                }, 300000)
            }
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>

<style scoped>
    @import '../assets/streamers.css';
</style>