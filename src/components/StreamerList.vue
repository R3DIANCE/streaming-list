<template>
  <div
    v-if="show_filters"
    class="sort"
  >
    <button
      :class="searchfilter == 'viewer_high' ? 'active' : ''"
      @click="set_filter('viewer_high')"
    >
      {{ t("streamer.sort.viewer_high") }}
    </button>
    <button
      :class="searchfilter == 'viewer_low' ? 'active' : ''"
      @click="set_filter('viewer_low')"
    >
      {{ t("streamer.sort.viewer_low") }}
    </button>
    <button
      :class="searchfilter == 'alphabetically_az' ? 'active' : ''"
      @click="set_filter('alphabetically_az')"
    >
      {{ t("streamer.sort.alphabetically_az") }}
    </button>
    <button
      :class="searchfilter == 'alphabetically_za' ? 'active' : ''"
      @click="set_filter('alphabetically_za')"
    >
      {{ t("streamer.sort.alphabetically_za") }}
    </button>
    <button
      :class="searchfilter.includes('shuffle') ? 'active' : ''"
      @click="set_filter('shuffle')"
    >
      {{ t("streamer.sort.shuffle") }}
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
          ? 'show_filters_button state_down'
          : 'show_filters_button state_up'
      "
      width="71"
      height="71"
      src="../assets/img/site/up.svg"
    >
  </div>
  <div
    v-if="streamers.length > 0"
    class="searchcombo"
    :title="t('page.searchinfo')"
  >
    <input
      v-model="searchword"
      type="text"
      :placeholder="t('page.search')"
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
    v-memo="[streamers, imgCacheKey, searchfilter, searchword]"
    class="cards"
  >
    <StreamerItem
      v-for="stream of filterstreamers"
      :key="stream.user_id"
      :stream="stream"
      :cache-key="imgCacheKey"
    />
  </ul>
  <div v-if="streamers.length <= 0">
    <h1 class="nolive">
      {{ t("page.nolive") }}
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

<script setup>
import { ref, onUnmounted, onUpdated, onMounted, onBeforeMount, computed } from "vue";
import { useI18n } from "vue-i18n";
import StreamerItem from "./StreamerItem.vue";
import api from "../mixins/api.js";
import useDebouncedRef from './useDebouncedRef.js';

const emit = defineEmits(["set_viewer_count", "set_streamer_count"]);

const { t } = useI18n({
    inheritLocale: true,
});

const streamers = ref([]);
const timer = ref(null);
const imgCacheKey = ref(Math.random().toString().substring(2, 8));
const searchword = useDebouncedRef("", 300);
const show_filters = ref(true);
const small_device = ref(false);
// possible values: alphabetically_az, alphabetically_za, viewer_high, viewer_low, shuffle
// default value: viewer_high
const searchfilter = ref("viewer_high");

// load filter from localstorage
try {
    const load_filter = localStorage.getItem("sort_method");
    if (load_filter != undefined) { searchfilter.value = load_filter; }
} catch (error) {
    console.warn("localstorage error.");
}

function window_resize() {
    const width = window.innerWidth;
    // const height = window.innerHeight

    small_device.value = width < 742;
    show_filters.value = !small_device.value;
}

function filterObject(obj) {
    return {
        user_id: obj.user_id,
        user_name: obj.user_name,
        title: obj.title,
        viewer_count: obj.viewer_count,
        started_at: obj.started_at,
        thumbnail_url: obj.thumbnail_url
    };
}

async function get_streamers() {
    const streaming_list_update = new CustomEvent('streaming-list-update', {
        detail: {
            message: ''
        }
    });
    let api_response = await api.fetch_or_cache(
        import.meta.env.VERCEL_ENV == "production"
            ? "/api/streamers"
            : import.meta.env.VITE_SEARCH_SERVER,
        "streamers"
    );

    if (api_response == {}) { api_response = []; }

    streamers.value = api_response.map(filterObject);

    setTimeout(() => {
        window.dispatchEvent(streaming_list_update);
    }, 100);
}

function set_filter(new_filter) {
    if (new_filter == "shuffle") {
        if (streamers.value.length != 0) {
            searchfilter.value = `shuffle-${Math.random().toString().substring(2, 3)}`;
        }
    } else {
        searchfilter.value = new_filter;
    }
    
}

onBeforeMount(() => {
    get_streamers();
});

onMounted(() => {
    window_resize();
    window.addEventListener("resize", window_resize);
    // save selected filter on page exit
    window.addEventListener('beforeunload', () => {
        if (searchfilter.value.includes("shuffle")) {
            localStorage.setItem("sort_method", "shuffle");
        } else {
            localStorage.setItem("sort_method", searchfilter.value);
        }
        
    });
    if (timer.value == null) {
        timer.value = setInterval(() => {
            get_streamers();
            imgcachekey.value = Math.random().toString().substring(2, 8);
        }, 300000);
    }
});

onUpdated(() => {
    // create a array with only the viewer_count
    const viewerCount = streamers.value.map(obj => obj.viewer_count);
    // count all viewers together
    const totalViewerCount = viewerCount.reduce((acc, count) => acc + count, 0);

    // emit the result to the App.vue component that will pass it to the Pageheader.vue
    emit("set_viewer_count", totalViewerCount);
    emit("set_streamer_count", streamers.value.length);
});

onUnmounted(() => {
    clearInterval(timer.value);
    window.removeEventListener("resize", window_resize);
});

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
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
}

const filterstreamers = computed(() => {
    const tmp_searchword = searchword.value.toLowerCase();
    let local_filter = searchfilter.value;
    const tmp_streamers = streamers.value.filter((stream) => (
        stream.title.toLowerCase().includes(tmp_searchword) ||
        stream.user_name.toLowerCase().includes(tmp_searchword)
    ));

    if (local_filter.toLowerCase().includes("shuffle")) { local_filter = "shuffle"; }

    switch (local_filter) {
    case "viewer_high":
        return tmp_streamers.sort(function (a, b) {
            return a["viewer_count"] - b["viewer_count"];
        }).reverse();
    case "viewer_low":
        return tmp_streamers.sort(function (a, b) {
            return a["viewer_count"] - b["viewer_count"];
        });
    case "alphabetically_az":
        return tmp_streamers.sort(function (a, b) {
            const a1 = a["user_name"].toLowerCase();
            const b1 = b["user_name"].toLowerCase();
            return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;
        });
    case "alphabetically_za":
        return tmp_streamers.sort(function (a, b) {
            const a1 = a["user_name"].toLowerCase();
            const b1 = b["user_name"].toLowerCase();
            return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;
        }).reverse();
    case "shuffle":
        return shuffleArray(tmp_streamers);
    default:
        return tmp_streamers;
    }
});
</script>

<style lang="scss">
@import "../assets/StreamerList.scss";
</style>
