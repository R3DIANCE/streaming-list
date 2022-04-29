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
                "views": 0
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
                const response = await fetch("https://twitch-search-server.fly.dev/search?title=luckyv");
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
    .cards {
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        margin: 0;
        margin-left: auto;
        margin-right: auto;
        padding: 0;
        max-width: 80%;
    }

    .maintable {
        margin-bottom: 1%;
        margin-top: 1%;
    }

    .maintable h1 {
        margin-bottom: 0px;
        font-size: 3.5rem;
    }

    .maintable h2 {
        font-size: 2rem;
    }

    @media (max-width: 896px) {
        .cards {
            max-width: 90%;
        }
        table {
            width: 90%;
        }
    }

    @media (max-width: 641px) {
        .cards {
            max-width: 95%;
        }
        table {
            width: 95%;
        }
    }
</style>