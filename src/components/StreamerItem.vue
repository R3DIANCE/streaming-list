<template>
  <li class="cards-list-item">
    <a
      :href="'https://twitch.tv/' + stream.user_name"
      target="_blank"
      rel="noopener noreferrer"
      referrerpolicy="no-referrer"
    >
      <div
        class="card-item"
        @mouseover="mouseOver = true"
        @mouseleave="mouseOver = false"
      >
        <TwitchImage
          v-memo="[cacheKey, mouseOver]"
          :thumbnail-url="stream.thumbnail_url"
          :user-name="stream.user_name"
          :cache-key="cacheKey"
          :mouse-over="mouseOver"
        />
        <div class="card-content">
          <div class="card-text">
            <p class="card-text-item">{{ stream.title }}</p>
            <table class="card-streamer-table">
              <tr
                :title="
                  t('streamer.tooltips.viewer', {
                    user: stream.user_name,
                    viewer: stream.viewer_count,
                  })
                "
              >
                <td>{{ t("streamer.viewer_count") }}</td>
                <td>{{ stream.viewer_count }}</td>
              </tr>
              <tr
                :title="
                  t('streamer.tooltips.live_since', {
                    user: stream.user_name,
                    time: new Date(
                      stream.started_at
                    ).toLocaleTimeString(),
                    total_time: calculate_time,
                  })
                "
              >
                <td>{{ t("streamer.live_since") }}</td>
                <td>{{ calculate_time }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </a>
  </li>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import TwitchImage from "./TwitchImage.vue";

const props = defineProps({
    stream: {
        type: Object,
        default: function() {
            return { 
                "user_id": "",
                "user_name": "",
                "title": "",
                "viewer_count": 0,
                "started_at": "2022-01-01T00:00:01Z",
                "thumbnail_url": "" 
            };
        }
    },
    cacheKey: {
        type: String,
        default: "000000"
    }
});

const { t } = useI18n({
    inheritLocale: true,
});
const mouseOver = ref(false);

const calculate_time = computed(() => {
    // Stream runtime calculation
    let startDate = new Date(props.stream.started_at).getTime();
    let timeEnd = Date.now();
    let diff = timeEnd - startDate;
    let utcdate = new Intl.DateTimeFormat("de", {
        timeZone: "UTC",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    }).format(diff);
    return utcdate;
});
</script>

<style scoped lang="scss">
@import "../assets/StreamerItem.scss";
</style>
