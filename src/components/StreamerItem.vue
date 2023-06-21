<template>
    <li class="cards-list-item">
        <a
            :href="`https://twitch.tv/${stream.user_name}`"
            target="_blank"
            rel="noopener noreferrer"
            referrerpolicy="no-referrer"
        >
            <div class="card-item">
                <TwitchImage
                    :thumbnail-url="stream.thumbnail_url"
                    :user-name="stream.user_name"
                    :cache-key="cacheKey"
                />
                <div class="card-content">
                    <p class="card-text-item">{{ stream.title }}</p>
                    <table class="card-streamer-table">
                        <tr
                            :title="
                                t('tooltips.viewer', {
                                    user: stream.user_name,
                                    viewer: stream.viewer_count,
                                })
                            "
                        >
                            <td>{{ t("viewer_count") }}</td>
                            <td>{{ stream.viewer_count }}</td>
                        </tr>
                        <tr
                            :title="
                                t('tooltips.live_since', {
                                    user: stream.user_name,
                                    time: new Date(
                                        stream.started_at
                                    ).toLocaleDateString(),
                                    total_time: calculate_time,
                                })
                            "
                        >
                            <td>{{ t("live_since") }}</td>
                            <td>{{ calculate_time }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </a>
    </li>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import TwitchImage from "./TwitchImage.vue"

const props = defineProps({
    stream: {
        type: Object,
        default: function () {
            return {
                user_id: "",
                user_name: "",
                title: "",
                viewer_count: 0,
                started_at: "2022-01-01T00:00:01Z",
                thumbnail_url: "",
            }
        },
    },
    cacheKey: {
        type: String,
        default: "000000",
    },
})

const { t } = useI18n({
    useScope: "local",
    inheritLocale: true,
})

const calculate_time = computed(() => {
    // Stream runtime calculation
    let startDate = new Date(props.stream.started_at).getTime()
    let timeEnd = Date.now()
    let diff = timeEnd - startDate
    let utcdate = new Intl.DateTimeFormat("de", {
        timeZone: "UTC",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    }).format(diff)
    return utcdate
})
</script>

<style scoped lang="scss">
@import "../assets/css/StreamerItem.scss";
</style>

<i18n lang="json">
{
    "de": {
        "viewer_count": "Zuschauer:",
        "live_since": "Live seit:",
        "tooltips": {
            "viewer": "{user} hat gerade {viewer} Zuschauer:innen.",
            "live_since": "{user} ist live seit {time} Uhr und damit {total_time} Stunden."
        }
    },
    "en": {
        "viewer_count": "Viewers:",
        "live_since": "Live since:",
        "tooltips": {
            "viewer": "{user} has {viewer} viewers.",
            "live_since": "{user} is live since {time}, which is {total_time} hours."
        }
    }
}
</i18n>
