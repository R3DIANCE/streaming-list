<template>
    <li class="cards-list-item">
        <a
            :href="'https://twitch.tv/' + stream['user_name']"
            target="_blank"
            rel="noopener noreferrer"
            referrerpolicy="no-referrer"
        >
            <div
                class="card-item"
                @mouseover="mouseover = true"
                @mouseleave="mouseover = false"
            >
                <TwitchImage
                    :thumbnail_url="this.stream['thumbnail_url']"
                    :user_name="this.stream['user_name']"
                    :cachekey="this.cachekey"
                    :mouseover="this.mouseover"
                    v-memo="[this.cachekey, this.mouseover]"
                />
                <div class="card-content" v-memo="[this.stream]">
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
                        </table>
                        <div class="tags" title="stream tags">
                            <span
                                class="tag"
                                :key="tag"
                                v-for="tag of stream['tags']"
                            >
                                {{
                                    language == undefined
                                        ? tag["localization_names"]["en-us"]
                                        : tag["localization_names"][language]
                                }}
                            </span>
                        </div>
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
        return {
            mouseover: false,
            language: import.meta.env.VITE_TAGS_LANG,
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
            let startDate = new Date(this.stream["started_at"])
            let timeEnd = new Date()
            let diff = timeEnd - startDate
            let utcdate = new Date(diff).toLocaleTimeString("de", {
                timeZone: "UTC",
            })
            return utcdate
        },
    },
}
</script>

<style scoped lang="scss">
@import "../assets/StreamerItem.scss";
</style>
