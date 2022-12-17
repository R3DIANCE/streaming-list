<template>
  <table
    v-memo="[streamerCount, altv_server, altv_cdn]"
    class="stream_count_table"
  >
    <tr>
      <td>
        <h1
          :title="
            t('header.tooltips.streamer', {
              streamer_count: streamerCount,
            })
          "
        >
          {{
            t("header.streamer_head", { count: streamerCount })
          }}
        </h1>
      </td>
    </tr>
  </table>
  <table class="info_table">
    <tr
      :title="
        altv_server.version == altv_cdn.version
          ? t('header.tooltips.altv_version_1')
          : t('header.tooltips.altv_version_2', {
            version: altv_cdn.version,
          })
      "
    >
      <td>
        <a
          href="https://altv.mp"
          rel="noopener noreferrer"
          referrerpolicy="no-referrer"
          target="_blank"
        >
          {{ t("header.altv_head_version") }}
        </a>
      </td>
      <td>
        {{
          altv_server_active
            ? altv_server.version == altv_cdn.version
              ? `${altv_server.version} ✔️`
              : `${altv_server.version} ⬆️`
            : "0.0 ❌"
        }}
      </td>
    </tr>
    <tr
      :title="
        altv_server_active
          ? t('header.tooltips.gameserver_1')
          : t('header.tooltips.gameserver_2')
      "
    >
      <td>
        <a
          :href="`https://api.altv.mp/server/${altv_server['id']}`"
          rel="noopener noreferrer"
          referrerpolicy="no-referrer"
          target="_blank"
        >
          {{ t("header.game_server_head") }}
        </a>
      </td>
      <td>{{ altv_server_active ? "Online ✔️" : "Offline ❌" }}</td>
    </tr>
    <tr
      :title="
        altv_server_active
          ? t('header.tooltips.players', {
            player: altv_server.players,
          })
          : ''
      "
    >
      <td>{{ t("header.players_online_head") }}</td>
      <td>
        {{
          altv_server_active
            ? altv_server["players"] +
              "/" +
              altv_server["maxPlayers"]
            : "0/0"
        }}
      </td>
    </tr>
    <tr :title="t('header.tooltips.viewer', { viewer: viewerCount })">
      <td>{{ t("header.viewers_head") }}</td>
      <td>{{ viewerCount }}</td>
    </tr>
    <tr :title="t('header.tooltips.refresh')">
      <td>{{ t("header.last_refresh_head") }}</td>
      <td>{{ last_update }}</td>
    </tr>
  </table>
</template>

<script setup>
import { onMounted, onUnmounted, onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import api from "../mixins/api.js";

const props = defineProps({
    viewerCount: {
        type: Number,
        default: 0
    },
    streamerCount: {
        type: Number,
        default: 0
    },
});

const { locale, t } = useI18n({
    inheritLocale: true,
});

const altv_server_active = ref(false);
const last_update = ref(t("header.last_update_never"));
const update_timer = ref(null);
const altv_cdn = ref({});
const altv_server = ref({});

async function fetch_altv_server() {
    const cdn_response = await api.fetch_or_cache(
        "https://cdn.altv.mp/server/release/x64_linux/update.json",
        "altv_server_cdn",
        60
    );

    altv_cdn.value = cdn_response;
}

async function fetch_altv_cdn() {
    const api_response = await api.fetch_or_cache(
        import.meta.env.VERCEL_ENV == "production"
            ? "/api/altv"
            : `https://api.altv.mp/server/${
                import.meta.env.VITE_ALTV_SERVER_ID
            }`,
        "altv_server_data"
    );

    last_update.value = new Date().toLocaleTimeString(locale);

    if (api_response["active"]) {
        altv_server.value = api_response["info"];
        altv_server_active.value = api_response["active"];
    }
}

onBeforeMount(() => {
    fetch_altv_cdn();
    fetch_altv_server();
});

onMounted(() => {
    if (update_timer.value == null) {
        update_timer.value = setInterval(() => {
            fetch_altv_cdn();
            fetch_altv_server();
        }, 120000);
    }
});

onUnmounted(() => {
    clearInterval(update_timer.value);
});
</script>

<style scoped lang="scss">
@import "../assets/PageHeader.scss";
</style>
