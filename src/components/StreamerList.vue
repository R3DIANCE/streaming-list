<template>
  <div
    v-if="show_filters"
    class="sort"
  >
    <button
      :class="filter == 'viewer_high' ? 'active' : ''"
      @click="set_filter('viewer_high')"
    >
      {{ $t("streamer.sort.viewer_high") }}
    </button>
    <button
      :class="filter == 'viewer_low' ? 'active' : ''"
      @click="set_filter('viewer_low')"
    >
      {{ $t("streamer.sort.viewer_low") }}
    </button>
    <button
      :class="filter == 'alphabetically_az' ? 'active' : ''"
      @click="set_filter('alphabetically_az')"
    >
      {{ $t("streamer.sort.alphabetically_az") }}
    </button>
    <button
      :class="filter == 'alphabetically_za' ? 'active' : ''"
      @click="set_filter('alphabetically_za')"
    >
      {{ $t("streamer.sort.alphabetically_za") }}
    </button>
    <button
      :class="filter.includes('shuffle') ? 'active' : ''"
      @click="set_filter('shuffle')"
    >
      {{ $t("streamer.sort.shuffle") }}
    </button>
  </div>
  <div
    v-if="small_device"
    @click="show_filters = !show_filters"
  >
    <img
      :alt="
        show_filters
          ? 'hide filters button'
          : 'expand filters button'
      "
      :class="
        show_filters
          ? 'show_filters_button state2'
          : 'show_filters_button state1'
      "
      width="71"
      height="71"
      src="../assets/img/site/up.svg"
    >
  </div>
  <div
    v-if="streamers.length > 0"
    class="searchcombo"
    :title="$t('page.searchinfo')"
  >
    <input
      v-model="searchword"
      type="text"
      :placeholder="$t('page.search')"
    >
    <div class="clear_input">
      <img
        alt="clear search"
        src="../assets/img/site/x.svg"
        @click="searchword = ''"
      >
    </div>
  </div>
  <ul
    v-if="streamers.length > 0"
    v-memo="[streamers, imgcachekey, filter, searchword]"
    class="cards"
  >
    <StreamerItem
      v-for="stream of filterstreamers"
      :key="stream['user_id']"
      :stream="stream"
      :cachekey="imgcachekey"
    />
  </ul>
  <div v-if="streamers.length <= 0">
    <h1 class="nolive">
      {{ $t("page.nolive") }}
    </h1>
  </div>
  <a
    v-if="filterstreamers.length > 3"
    href="#top"
    class="top"
    aria-label="Go back to top."
  >
    <div class="mock_button">
      <img
        alt=""
        width="66"
        height="66"
        src="../assets/img/site/up.svg"
      >
    </div>
  </a>
</template>

<script>
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import StreamerItem from "./StreamerItem.vue";
import api from "../mixins/api.js";
import useDebouncedRef from './useDebouncedRef.js';

export default {
    name: "StreamerList",
    components: {
        StreamerItem,
    },
    emits: ["set_viewer_count", "set_streamer_count"],
    setup() {
        const { locale, t } = useI18n({
            inheritLocale: true,
        });

        const streamers = ref([]);
        const views = ref(0);
        const timer = ref(null);
        const imgcachekey = ref(Math.random().toString().substring(2, 8));
        const searchword = useDebouncedRef("", 300);
        const show_filters = ref(true);
        const small_device = ref(false);
        // possible values: alphabetically_az, alphabetically_za, viewer_high, viewer_low, shuffle
        // default value: viewer_high
        let filter = ref("viewer_high");

        // load filter from localstorage
        try {
            const load_filter = localStorage.getItem("sort_method");
            if (load_filter != undefined) { filter = ref(load_filter); }
        } catch (error) {
            console.warn("localstorage error.");
        }
        
        return {
            streamers,
            views,
            timer,
            imgcachekey,
            searchword,
            show_filters,
            small_device,
            filter,
            locale, t
        };
    },
    computed: {
        filterstreamers() {
            const { streamers, searchword } = this;
            const tmp_searchword = searchword.toLowerCase();
            const filtered_streamers = streamers.filter((stream) => (
                stream.title.toLowerCase().includes(tmp_searchword) ||
                stream.user_name.toLowerCase().includes(tmp_searchword)
            ));

            if (this.filter.toLowerCase().includes("shuffle")) { this.filter = "shuffle"; }

            switch (this.filter) {
                case "viewer_high":
                    return filtered_streamers.sort(function (a, b) {
                        return a["viewer_count"] - b["viewer_count"];
                    }).reverse();
                case "viewer_low":
                    return filtered_streamers.sort(function (a, b) {
                        return a["viewer_count"] - b["viewer_count"];
                    });
                case "alphabetically_az":
                    return filtered_streamers.sort(function (a, b) {
                        const a1 = a["user_name"].toLowerCase();
                        const b1 = b["user_name"].toLowerCase();
                        return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;
                    });
                case "alphabetically_za":
                    return filtered_streamers.sort(function (a, b) {
                        const a1 = a["user_name"].toLowerCase();
                        const b1 = b["user_name"].toLowerCase();
                        return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;
                    }).reverse();
                case "shuffle":
                    return this.shuffleArray(filtered_streamers);
                default:
                    return filtered_streamers;
            }
        },
    },
    updated() {
        // create a array with only the viewer_count
        const viewerCount = this.streamers.map(obj => obj.viewer_count);
        // count all viewers together
        const totalViewerCount = viewerCount.reduce((acc, count) => acc + count, 0);

        // emit the result to the App.vue component that will pass it to the Pageheader.vue
        this.$emit("set_viewer_count", totalViewerCount);
        this.$emit("set_streamer_count", this.streamers.length);
    },
    mounted: function () {
        this.window_resize();
        window.addEventListener("resize", this.window_resize);
        // save selected filter on page exit
        window.addEventListener('beforeunload', () => {
            localStorage.setItem("sort_method", this.filter);
        });
        if (this.timer == null) {
            this.timer = setInterval(() => {
                this.get_streamers();
                this.imgcachekey = Math.random().toString().substring(2, 8);
            }, 300000);
        }
    },
    beforeMount() {
        this.get_streamers();
    },
    unmounted() {
        clearInterval(this.timer);
        window.removeEventListener("resize", this.window_resize);
    },
    methods: {
        window_resize() {
            const width = window.innerWidth;
            // const height = window.innerHeight

            this.small_device = width < 742;
            this.show_filters = !this.small_device;
        },
        filterObject(obj) {
            return {
                user_id: obj.user_id,
                user_name: obj.user_name,
                title: obj.title,
                viewer_count: obj.viewer_count,
                started_at: obj.started_at,
                thumbnail_url: obj.thumbnail_url
            };
        },
        async get_streamers() {
            let api_response = await api.fetch_or_cache(
                import.meta.env.VERCEL_ENV == "production"
                    ? "/api/streamers"
                    : import.meta.env.VITE_SEARCH_SERVER,
                "streamers"
            );

            if (api_response == {}) { api_response = []; }

            this.streamers = api_response.map(this.filterObject);;
        },
        // Fisher-Yates shuffle algorithm
        shuffleArray(array) {
            let remainingElements = array.length;
            // Iterate through the array from the last element to the first
            while (remainingElements) {
                // Pick a random element from the remaining portion of the array
                let randId = Math.floor(Math.random() * remainingElements--);
                // Swap the current element with the random element
                let tmp = array[remainingElements];
                array[remainingElements] = array[randId];
                array[randId] = tmp;
            }
            return array;
        },
        set_filter(filter) {
            if (filter == "shuffle") {
                if (this.streamers.length != 0) {
                    this.filter = `shuffle-${Math.random().toString().substring(2, 3)}`;
                }
            } else {
                this.filter = filter;
            }
            
        }
    },
};
</script>

<style lang="scss">
@import "../assets/StreamerList.scss";
</style>
