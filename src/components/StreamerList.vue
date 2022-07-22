<template>
    <div
        class="searchcombo"
        v-if="streamers.length > 0"
        :title="$t('page.searchinfo')"
    >
        <input
            type="text"
            v-model="searchword"
            :placeholder="$t('page.search')"
        />
        <div class="clear_input">
            <img v-on:click="clear_input" src="/img/site/x.svg" />
        </div>
    </div>
    <ul class="cards" v-if="streamers.length > 0">
        <StreamerItem
            :stream="stream"
            :cachekey="imgcachekey"
            :key="stream['user_id']"
            v-for="stream of filterstreamers"
        />
    </ul>
    <div v-if="streamers.length <= 0">
        <h1 class="nolive">{{ $t("page.nolive") }}</h1>
    </div>
    <a v-if="filterstreamers.length > 3" href="#top" class="top">
        <div class="mock_button">
            <img src="/img/site/up.svg" />
        </div>
    </a>
</template>

<script>
import { useI18n } from "vue-i18n"
import StreamerItem from "./StreamerItem.vue"
import api from "../mixins/api.js"

export default {
    name: "StreamerList",
    setup() {
        const { locale, t } = useI18n({
            inheritLocale: true,
        })

        return { locale, t }
    },
    emits: ["streamers", "total-viewers"],
    props: {},
    components: {
        StreamerItem,
    },
    data() {
        return {
            streamers: [],
            views: 0,
            search_server: "",
            timer: null,
            imgcachekey: Math.random().toString().substr(2, 8),
            searchword: "",
        }
    },
    computed: {
        filterstreamers() {
            const { streamers, searchword } = this
            return streamers.filter((stream) => {
                let search_value = searchword.toLowerCase()
                if (
                    stream.title.toLowerCase().includes(search_value) ||
                    stream.user_login.includes(search_value)
                ) {
                    return stream
                }
            })
        },
    },
    async created() {
        await this.get_tags()
        const api_data = await api.fetch_or_cache(
            import.meta.env.VERCEL_ENV == "production"
                ? "/api/streamers"
                : import.meta.env.VITE_SEARCH_SERVER,
            "streamers"
        )
        this.streamers = api_data["data"]

        let viewers = 0
        let streamers = 0
        this.streamers.forEach((stream) => {
            viewers = viewers + stream["viewer_count"]
            streamers++
            stream["tags"] = []
            stream["tag_ids"].forEach((stream_tag) => {
                if (this.tags[stream_tag] != undefined) {
                    stream["tags"].push(this.tags[stream_tag])
                }
            })
            if (stream["is_mature"]) {
                stream["tags"].push({
                    "bg-bg": "18 +",
                    "cs-cz": "18 +",
                    "da-dk": "18 +",
                    "de-de": "18 +",
                    "el-gr": "18 +",
                    "en-us": "18 +",
                    "es-es": "18 +",
                    "es-mx": "18 +",
                    "fi-fi": "18 +",
                    "fr-fr": "18 +",
                    "hu-hu": "18 +",
                    "it-it": "18 +",
                    "ja-jp": "18 +",
                    "ko-kr": "18 +",
                    "nl-nl": "18 +",
                    "no-no": "18 +",
                    "pl-pl": "18 +",
                    "pt-br": "18 +",
                    "pt-pt": "18 +",
                    "ro-ro": "18 +",
                })
            }
        })
        this.set_total_views(viewers)
        this.set_streamers(streamers)
    },
    methods: {
        async get_tags() {
            // cache for 7 days
            const api_data = await api.fetch_or_cache(
                import.meta.env.VERCEL_ENV == "production"
                    ? "/api/tags"
                    : import.meta.env.VITE_TAGS,
                "tags",
                10080
            )
            this.tags = api_data["data"]
        },
        set_total_views(viewers) {
            this.$emit("total-viewers", viewers)
        },
        set_streamers(streamers) {
            this.$emit("streamers", streamers)
        },
        async updatedata() {
            await this.fetch_twitch()
            this.imgcachekey = Math.random().toString().substr(2, 8)
        },
        clear_input() {
            this.searchword = ""
        },
    },
    mounted: function () {
        if (this.timer == null) {
            this.timer = setInterval(() => {
                this.updatedata()
            }, 300000)
        }
    },
    unmounted() {
        clearInterval(this.timer)
    },
}
</script>

<style lang="scss">
@import "../assets/StreamerList.scss";
</style>
