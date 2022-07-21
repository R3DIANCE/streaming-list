<template>
    <li class="cards-list-item">
        <a
            :href="'https://twitch.tv/' + stream['user_name']"
            target="_blank"
            rel="noopener noreferrer"
        >
            <div class="card-item">
                <TwitchImage :stream="this.stream" :cachekey="this.cachekey" />
                <div class="card-content">
                    <div class="card-text">
                        <p class="card-text-item">{{ stream["title"] }}</p>
                        <table class="card-streamer-table">
                            <tr
                                :title="
                                    $t('streamer.tooltips.viewer', {
                                        user: stream['user_name'],
                                        viewer: stream['viewer_count'],
                                    })
                                "
                            >
                                <td>{{ $t("streamer.viewer_count") }}</td>
                                <td>{{ stream["viewer_count"] }}</td>
                            </tr>
                            <tr
                                :title="
                                    $t('streamer.tooltips.live_since', {
                                        user: stream['user_name'],
                                        time: new Date(
                                            stream['started_at']
                                        ).toLocaleTimeString(),
                                        total_time: calculate_time,
                                    })
                                "
                            >
                                <td>{{ $t("streamer.live_since") }}</td>
                                <td>{{ calculate_time }}</td>
                            </tr>
                            <tr class="tags" title="stream tags">
                                <span class="tag"
                                    :key="tag"
                                    v-for="tag of stream['tags']"
                                >{{ tag["en-us"] }}</span>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </a>
    </li>
</template>

<script>
import { useI18n } from "vue-i18n"
import TwitchImage from "./TwitchImage.vue"

export default {
    name: "StreamerItem",
    setup() {
        const { locale, t } = useI18n({
            inheritLocale: true,
        })

        return { locale, t }
    },
    data() {
        return {}
    },
    mounted() {
        if (this.stream["is_mature"]) {
            this.stream["tags"].push({
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
                "ro-ro": "18 +"
            })
        }
    },
    components: {
        TwitchImage,
    },
    props: {
        stream: Object,
        cachekey: String,
    },
    computed: {
        calculate_time() {
            // Stream runtime calculation
            let startDate = new Date(this.stream["started_at"]);
            let timeEnd = new Date();
            let diff = timeEnd - startDate;
            let utcdate = new Date(diff).toLocaleTimeString("de", {
                timeZone: "UTC",
            });
            return utcdate;
        },
    },
}
</script>

<style scoped lang="scss">
@import "../assets/StreamerItem.scss";
</style>
