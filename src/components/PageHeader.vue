<template>
  <table
    v-memo="[streamer_count, altv_server, altv_cdn]"
    class="stream_count_table"
  >
    <tr>
      <td>
        <h1
          :title="
            $t('header.tooltips.streamer', {
              streamer_count: streamer_count,
            })
          "
        >
          {{
            $t("header.streamer_head", { count: streamer_count })
          }}
        </h1>
      </td>
    </tr>
  </table>
  <table class="info_table">
    <tr
      :title="
        altv_server['version'] == altv_cdn['version']
          ? $t('header.tooltips.altv_version_1')
          : $t('header.tooltips.altv_version_2', {
            version: altv_cdn['version'],
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
          {{ $t("header.altv_head_version") }}
        </a>
      </td>
      <td>
        {{
          altv_server_active
            ? altv_server["version"] == altv_cdn["version"]
              ? `${altv_server["version"]} ✔️`
              : `${altv_server["version"]} ⬆️`
            : "0.0 ❌"
        }}
      </td>
    </tr>
    <tr
      :title="
        altv_server_active
          ? $t('header.tooltips.gameserver_1')
          : $t('header.tooltips.gameserver_2')
      "
    >
      <td>
        <a
          :href="`https://api.altv.mp/server/${altv_server['id']}`"
          rel="noopener noreferrer"
          referrerpolicy="no-referrer"
          target="_blank"
        >
          {{ $t("header.game_server_head") }}
        </a>
      </td>
      <td>{{ altv_server_active ? "Online ✔️" : "Offline ❌" }}</td>
    </tr>
    <tr
      :title="
        altv_server_active
          ? $t('header.tooltips.players', {
            player: altv_server['players'],
          })
          : ''
      "
    >
      <td>{{ $t("header.players_online_head") }}</td>
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
    <tr :title="$t('header.tooltips.viewer', { viewer: viewer_count })">
      <td>{{ $t("header.viewers_head") }}</td>
      <td>{{ viewer_count }}</td>
    </tr>
    <tr :title="$t('header.tooltips.refresh')">
      <td>{{ $t("header.last_refresh_head") }}</td>
      <td>{{ last_update }}</td>
    </tr>
  </table>
</template>

<script>
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import api from "../mixins/api.js";

export default {
    name: "PageHeader",
    props: {
        viewer_count: Number,
        streamer_count: Number,
    },
    setup() {
        const { locale, t } = useI18n({
            inheritLocale: true,
        });

        const altv_server_active = ref(false);
        const last_update = ref(t("header.last_update_never"));
        const altv_cdn = ref({});
        const update_timer = ref(null);
        const altv_server = ref({});

        return { 
            altv_server_active,
            last_update,
            altv_cdn,
            update_timer,
            altv_server,
            locale, t 
        };
    },
    beforeMount() {
        this.fetch_altv_cdn();
        this.fetch_altv_server();
    },
    mounted: function () {
        if (this.update_timer == null) {
            this.update_timer = setInterval(() => {
                this.fetch_altv_cdn();
                this.fetch_altv_server();
            }, 120000);
        }
    },
    unmounted() {
        clearInterval(this.update_timer);
    },
    methods: {
        async fetch_altv_server() {
            const cdn_response = await api.fetch_or_cache(
                "https://cdn.altv.mp/server/release/x64_linux/update.json",
                "altv_server_cdn",
                60
            );

            this.altv_cdn = cdn_response;
        },
        async fetch_altv_cdn() {
            const api_response = await api.fetch_or_cache(
                import.meta.env.VERCEL_ENV == "production"
                    ? "/api/altv"
                    : `https://api.altv.mp/server/${
                          import.meta.env.VITE_ALTV_SERVER_ID
                      }`,
                "altv_server_data"
            );

            this.last_update = new Date().toLocaleTimeString(this.locale);

            if (api_response["active"]) {
                this.altv_server = api_response["info"];
                this.altv_server_active = api_response["active"];
            }
        },
    },
};
</script>

<style scoped lang="scss">
@import "../assets/PageHeader.scss";
</style>
