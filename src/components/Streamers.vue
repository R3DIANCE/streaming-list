<template>
    <div class="searchcombo">
        <input type="text" v-model="searchword" placeholder="Suche ..." />
    </div>
    
    <ul class="cards">
        <Streamer :stream=stream :cachekey=imgcachekey :key="stream['user_id']" v-for="(stream) of filterstreamers" />
    </ul>
</template>

<script>
    import Streamer from './Streamer.vue';

    export default {
        name: "Streamerlist",
        emits: ["streamers", "total-viewers"],
        props: {},
        components: {
            Streamer
        },
        data() {
            return {
                streamers: [],
                views: 0,
                search_server: "",
                timer: null,
                imgcachekey: Math.random().toString().substr(2, 8),
                searchword: ""
            }
        },
        computed: {
            filterstreamers() {
                const { streamers, searchword } = this;
                return streamers.filter((stream) => {
                    let search_value = searchword.toLowerCase();
                    if (stream.title.toLowerCase().includes(search_value) ||
                        stream.user_login.includes(search_value)) {
                        return stream;
                    }
                });
            },
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
                let url = import.meta.env.VERCEL_ENV == "production" ? "/api/streamers":import.meta.env.VITE_SEARCH_SERVER;
                try {
                    const response = await fetch(url);
                    const api_data = await response.json();
                    if (api_data["status"] == "done") {
                        return api_data["data"]
                    }
                } catch (Exception) {
                    console.error(Exception);
                    return [];
                }
            },
            set_total_views(viewers) {
                this.$emit("total-viewers", viewers);
            },
            set_streamers(streamers) {
                this.$emit("streamers", streamers);
            },
            async updatedata() {
                await this.fetch_twitch();
                this.imgcachekey = Math.random().toString().substr(2, 8);
            }
        },
        mounted: function () {
            if (this.timer == null) {
                this.timer = setInterval(() => {
                    this.updatedata();
                }, 300000)
            }
        },
        unmounted() {
            clearInterval(this.timer)
        }
    }
</script>

<style scoped>
    @import '../assets/streamers.css';
</style>