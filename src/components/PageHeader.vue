<template>
    <table
        class="stream_count_table"
        v-memo="[this.online_count, this.altv_data, this.cdn_data]"
    >
        <tr>
            <td>
                <h1
                    :title="
                        $t('header.tooltips.streamer', {
                            streamer_count: online_count,
                        })
                    "
                >
                    {{
                        $t("header.streamer_head", { count: this.online_count })
                    }}
                </h1>
            </td>
        </tr>
    </table>
    <table class="info_table">
        <tr
            :title="
                this.altv_data['version'] == this.cdn_data['version']
                    ? $t('header.tooltips.altv_version_1')
                    : $t('header.tooltips.altv_version_2', {
                          version: this.cdn_data['version'],
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
                    active
                        ? this.altv_data["version"] == cdn_data["version"]
                            ? `${this.altv_data["version"]} ✔️`
                            : `${this.altv_data["version"]} ⬆️`
                        : "0.0 ❌"
                }}
            </td>
        </tr>
        <tr
            :title="
                active
                    ? $t('header.tooltips.gameserver_1')
                    : $t('header.tooltips.gameserver_2')
            "
        >
            <td>
                <a
                    :href="`https://api.altv.mp/server/${this.altv_data['id']}`"
                    rel="noopener noreferrer"
                    referrerpolicy="no-referrer"
                    target="_blank"
                >
                    {{ $t("header.game_server_head") }}
                </a>
            </td>
            <td>{{ active ? "Online ✔️" : "Offline ❌" }}</td>
        </tr>
        <tr
            :title="
                active
                    ? $t('header.tooltips.players', {
                          player: this.altv_data['players'],
                      })
                    : ''
            "
        >
            <td>{{ $t("header.players_online_head") }}</td>
            <td>
                {{
                    active
                        ? this.altv_data["players"] +
                          "/" +
                          this.altv_data["maxPlayers"]
                        : "0/0"
                }}
            </td>
        </tr>
        <tr :title="$t('header.tooltips.viewer', { viewer: viewers })">
            <td>{{ $t("header.viewers_head") }}</td>
            <td>{{ viewers }}</td>
        </tr>
        <tr :title="$t('header.tooltips.refresh')">
            <td>{{ $t("header.last_refresh_head") }}</td>
            <td>{{ lastupdate }}</td>
        </tr>
    </table>
</template>

<script>
import { useI18n } from "vue-i18n"
import { ref } from "vue"
import api from "../mixins/api.js"

export default {
    name: "PageHeader",
    setup() {
        const { locale, t } = useI18n({
            inheritLocale: true,
        })

        const active = ref(false)
        const lastupdate = ref(t("header.last_update_never"))
        const cdn_data = ref({})
        const timer = ref(null)
        const altv_data = ref({})

        return { 
            active,
            lastupdate,
            cdn_data,
            timer,
            altv_data,
            locale, t 
        }
    },
    props: {
        viewers: Number,
        online_count: Number,
    },
    components: {},
    methods: {
        async fetch_altv_server() {
            const cdn_data = await api.fetch_or_cache(
                "https://cdn.altv.mp/server/release/x64_linux/update.json",
                "altv_server_cdn",
                60
            )

            this.cdn_data = cdn_data
        },
        async fetch_altv() {
            const api_data = await api.fetch_or_cache(
                import.meta.env.VERCEL_ENV == "production"
                    ? "/api/altv"
                    : `https://api.altv.mp/server/${
                          import.meta.env.VITE_ALTV_SERVER_ID
                      }`,
                "altv"
            )
            this.lastupdate = new Date().toLocaleTimeString(this.locale)

            if (api_data["active"]) {
                this.altv_data = api_data["info"]
                this.active = api_data["active"]
            }
        },
    },
    beforeMount() {
        this.fetch_altv()
        this.fetch_altv_server()
    },
    mounted: function () {
        if (this.timer == null) {
            this.timer = setInterval(() => {
                this.fetch_altv()
                this.fetch_altv_server()
            }, 120000)
        }
    },
    unmounted() {
        clearInterval(this.timer)
    },
}
</script>

<style scoped lang="scss">
@import "../assets/PageHeader.scss";
</style>
