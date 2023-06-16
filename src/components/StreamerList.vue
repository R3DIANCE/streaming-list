<template>
  <div
    v-if="show_filters"
    class="sort"
  >
    <button
      :class="searchfilter == 'viewer_high'|| searchfilter == 'viewer_low' ? 'active' : ''"
      @click="set_filter('viewer')"
    >
      {{ searchfilter == 'viewer_high' ? t("sort.viewer_low"):t("sort.viewer_high") }}
    </button>
    <button
      :class="searchfilter == 'alphabetically_az'|| searchfilter == 'alphabetically_za' ? 'active' : ''"
      @click="set_filter('alphabetically')"
    >
      {{ searchfilter == 'alphabetically_az' ? t("sort.alphabetically_za"):t("sort.alphabetically_az") }}
    </button>
    <button
      :class="searchfilter == 'runtime_high'|| searchfilter == 'runtime_low' ? 'active' : ''"
      @click="set_filter('runtime')"
    >
      {{ searchfilter == 'runtime_high' ? t("sort.runtime_low"):t("sort.runtime_high") }}
    </button>
    <button
      :class="searchfilter.includes('shuffle') ? 'active' : ''"
      @click="set_filter('shuffle')"
    >
      {{ t("sort.shuffle") }}
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
    :title="t('searchinfo')"
  >
    <input
      v-model="searchword"
      type="text"
      :placeholder="t('search')"
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
      {{ t("nolive") }}
    </h1>
  </div>
  <a
    v-if="filterstreamers.length > 3"
    href="#top"
    class="top"
    :aria-label="t('up')"
    :title="t('up')"
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
import { ref, onUnmounted, onMounted, computed, toRefs } from "vue";
import { useI18n } from "vue-i18n";
import StreamerItem from "./StreamerItem.vue";
import useDebouncedRef from './useDebouncedRef.js';

const { t } = useI18n({
    useScope: 'local',
    inheritLocale: true
});

const props = defineProps({
    streamers: Array
});

const { streamers } = toRefs(props);

const imgCacheKey = ref(Math.random().toString().substring(2, 8));
const searchword = useDebouncedRef("", 300);
const show_filters = ref(true);
const small_device = ref(false);
// possible values: alphabetically_az, alphabetically_za, viewer_high, viewer_low, shuffle, runtime_high, runtime_low
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

function set_filter(new_filter) {
    switch (new_filter) {
    case "shuffle":
        if (streamers.value.length != 0) {
            searchfilter.value =  `shuffle-${Math.random().toString().substring(2, 3)}`;
        }
        break;
    case "viewer":
        if (searchfilter.value == "viewer_high") {
            searchfilter.value = "viewer_low";
        } else {
            searchfilter.value = "viewer_high";
        }
        break;
    case "alphabetically":
        if (searchfilter.value == "alphabetically_az") {
            searchfilter.value = "alphabetically_za";
        } else {
            searchfilter.value = "alphabetically_az";
        }
        break;
    case "runtime":
        if (searchfilter.value == "runtime_high") {
            searchfilter.value = "runtime_low";
        } else {
            searchfilter.value = "runtime_high";
        }
        break;
    default:
        searchfilter.value == "viewer_high";
        break;
    }
}

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
});

onUnmounted(() => {
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
        return [...tmp_streamers].sort(function (a, b) {
            return a["viewer_count"] - b["viewer_count"];
        }).reverse();
    case "viewer_low":
        return [...tmp_streamers].sort(function (a, b) {
            return a["viewer_count"] - b["viewer_count"];
        });
    case "alphabetically_az":
        return [...tmp_streamers].sort(function (a, b) {
            const a1 = a["user_name"].toLowerCase();
            const b1 = b["user_name"].toLowerCase();
            return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;
        });
    case "alphabetically_za":
        return [...tmp_streamers].sort(function (a, b) {
            const a1 = a["user_name"].toLowerCase();
            const b1 = b["user_name"].toLowerCase();
            return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;
        }).reverse();
    case "shuffle":
        return shuffleArray(tmp_streamers);
    case "runtime_high":
        return [...tmp_streamers].sort(function (a, b) {
            const a1 = a["started_at"];
            const b1 = b["started_at"];
            return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;
        }).reverse();
    case "runtime_low":
        return [...tmp_streamers].sort(function (a, b) {
            const a1 = a["started_at"];
            const b1 = b["started_at"];
            return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;
        });
    default:
        return tmp_streamers;
    }
});
</script>

<style lang="scss">
@import "../assets/StreamerList.scss";
</style>

<i18n lang="json">
{
    "de-DE": {
        "search": "Suche...",
        "searchinfo": "Streamer:in, Stream Titel.",
        "nolive": "Leider ist aktuell kein Streamer:in live. 😴",
        "sort": {
            "viewer_high": "Zuschauer ⬆️",
            "viewer_low": "Zuschauer ⬇️",
            "alphabetically_az": "alphabetisch 🅰️- 🇿",
            "alphabetically_za": "alphabetisch 🇿 -🅰️",
            "shuffle": "Zufällig 🎲",
            "runtime_high": "Laufzeit ⌛",
            "runtime_low": "Laufzeit ⏳"
        },
        "up": "Zurück nach oben."
    },
    "en-US": {
        "search": "Search...",
        "searchinfo": "Streamer, Stream Title.",
        "nolive": "Unfortunately there is no streamer live at the moment. 😴",
        "sort": {
            "viewer_high": "Viewer ⬆️",
            "viewer_low": "Viewer ⬇️",
            "alphabetically_az": "alphabetically 🅰️- 🇿",
            "alphabetically_za": "alphabetically 🇿 -🅰️",
            "shuffle": "Random 🎲",
            "runtime_high": "Runtime ⌛",
            "runtime_low": "Runtime ⏳"
        },
        "up": "Back to top."
    }
}
</i18n>