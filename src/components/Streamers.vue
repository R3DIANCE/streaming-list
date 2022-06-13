<template>
    <div class="searchcombo">
        <input type="text" v-model="searchword" :placeholder="$t('page.search')" />
    </div>
    
    <ul class="cards">
        <Streamer :stream=stream :cachekey=imgcachekey :key="stream['user_id']" v-for="(stream) of filterstreamers" />
    </ul>
    <a href="#top" class="top">{{$t('page.up')}}</a>
</template>

<script>
    import { useI18n } from 'vue-i18n';
    import Streamer from './Streamer.vue';
    import api from '../mixins/api.js';

    export default {
        name: "Streamerlist",
        setup() {
            const { locale, t } = useI18n({
                inheritLocale: true
            })

            return { locale, t }
        },
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
            const api_data = await api.fetch_or_cache(import.meta.env.VERCEL_ENV == "production" ? "/api/streamers":import.meta.env.VITE_SEARCH_SERVER, "streamers");
            this.streamers = api_data["data"];
            
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

<style lang="scss">
    @import '../assets/streamers.scss';
</style>