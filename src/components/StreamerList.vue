<template>
    <div class="sort" v-if="show_filters">
        <button
            v-on:click="this.set_filter('viewer_high')"
            :class="filter == 'viewer_high' ? 'active' : ''"
        >
            {{ $t("streamer.sort.viewer_high") }}
        </button>
        <button
            v-on:click="this.set_filter('viewer_low')"
            :class="filter == 'viewer_low' ? 'active' : ''"
        >
            {{ $t("streamer.sort.viewer_low") }}
        </button>
        <button
            v-on:click="this.set_filter('alphabetically_az')"
            :class="filter == 'alphabetically_az' ? 'active' : ''"
        >
            {{ $t("streamer.sort.alphabetically_az") }}
        </button>
        <button
            v-on:click="this.set_filter('alphabetically_za')"
            :class="filter == 'alphabetically_za' ? 'active' : ''"
        >
            {{ $t("streamer.sort.alphabetically_za") }}
        </button>
        <button
            v-on:click="this.set_filter('shuffle')"
            :class="filter == 'shuffle' ? 'active' : ''"
        >
            {{ $t("streamer.sort.shuffle") }}
        </button>
    </div>
    <div v-if="this.small_device" v-on:click="show_filters_set">
        <img :class="this.show_filters ? 'show_filters_button state2':'show_filters_button state1'" src="/img/site/up.svg" />
    </div>
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
            // alphabetically_az, alphabetically_za, viewer_high, viewer_low, shuffle
            filter: this.get_filter(),
            show_filters: true,
            small_device: false,
            width: 0,
            height: 0
        }
    },
    computed: {
        filterstreamers() {
            const { streamers, searchword } = this
            let filtered_streamers = streamers.filter((stream) => {
                let search_value = searchword.toLowerCase()
                if (
                    stream.title.toLowerCase().includes(search_value) ||
                    stream.user_login.includes(search_value)
                ) {
                    return stream
                }
            })
            if (this.filter == "viewer_low") {
                return filtered_streamers.sort(function (a, b) {
                    return a["viewer_count"] - b["viewer_count"]
                })
            } else if (this.filter == "viewer_high") {
                return filtered_streamers
                    .sort(function (a, b) {
                        return a["viewer_count"] - b["viewer_count"]
                    })
                    .reverse()
            } else if (this.filter == "shuffle") {
                return this.shuffleArray(filtered_streamers)
            } else if (this.filter == "alphabetically_az") {
                return filtered_streamers.sort(function (a, b) {
                    const a1 = a["user_login"].toLowerCase()
                    const b1 = b["user_login"].toLowerCase()
                    return a1 < b1 ? -1 : a1 > b1 ? 1 : 0
                })
            } else if (this.filter == "alphabetically_za") {
                return filtered_streamers
                    .sort(function (a, b) {
                        const a1 = a["user_login"].toLowerCase()
                        const b1 = b["user_login"].toLowerCase()
                        return a1 < b1 ? -1 : a1 > b1 ? 1 : 0
                    })
                    .reverse()
            } else {
                return filtered_streamers
            }
        },
    },
    async created() {
        this.window_resize()
        window.addEventListener("resize", this.window_resize);
        await this.get_tags()
        await this.get_streamers()

        let viewers = 0
        let streamers = 0
        this.streamers.forEach((stream) => {
            viewers = viewers + stream["viewer_count"]
            streamers++
            stream["tags"] = []
            if (stream["tag_ids"] != undefined) {
                stream["tag_ids"].forEach((stream_tag) => {
                    if (this.tags[stream_tag] != undefined) {
                        stream["tags"].push(this.tags[stream_tag])
                    }
                })
            }

            if (stream["is_mature"]) {
                stream["tags"].push({
                    localization_names: {
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
                    },
                })
            }
        })
        this.set_total_views(viewers)
        this.set_streamers(streamers)
    },
    destroyed() {
        window.removeEventListener("resize", this.window_resize);
    },
    methods: {
        window_resize() {
            const new_width = window.innerWidth
            const new_height = window.innerHeight

            if (new_width < 742 && new_width != this.width) {
                this.show_filters = false
                this.small_device = true
            } else {
                this.show_filters = true
                this.small_device = false
            }
        },
        show_filters_set() {
            this.show_filters = !this.show_filters
        },
        async get_streamers() {
            const api_data = await api.fetch_or_cache(
                import.meta.env.VERCEL_ENV == "production"
                    ? "/api/streamers"
                    : import.meta.env.VITE_SEARCH_SERVER,
                "streamers"
            )

            if (api_data == undefined) {
                return
            }

            this.streamers = api_data["data"]
        },
        async get_tags() {
            // cache for 7 days
            const api_data = await api.fetch_or_cache(
                "https://raw.githubusercontent.com/Nickwasused/twitch-tag-list/gh-pages/tags.min.json",
                "tags",
                10080
            )

            this.tags = api_data
        },
        set_total_views(viewers) {
            this.$emit("total-viewers", viewers)
        },
        set_streamers(streamers) {
            this.$emit("streamers", streamers)
        },
        async updatedata() {
            // await this.fetch_twitch()
            this.imgcachekey = Math.random().toString().substr(2, 8)
        },
        clear_input() {
            this.searchword = ""
        },
        shuffleArray(array) {
            let curId = array.length
            // There remain elements to shuffle
            while (0 !== curId) {
                // Pick a remaining element
                let randId = Math.floor(Math.random() * curId)
                curId -= 1
                // Swap it with the current element.
                let tmp = array[curId]
                array[curId] = array[randId]
                array[randId] = tmp
            }
            return array
        },
        set_filter(filter) {
            if (filter == this.filter) {
                return
            }
            this.filter = filter
            localStorage.setItem("sort:method", filter)
        },
        get_filter() {
            if (localStorage.getItem("sort:method") != undefined) {
                return localStorage.getItem("sort:method")
            } else {
                return "viewer_high"
            }
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
