<template>
    <table class="maintable">
        <tr>
            <td>
                <h1
                    :title="
                        $t('header.tooltips.streamer', {
                            streamer_count: online_count,
                        })
                    "
                >
                    {{ $t("header.streamer_head", { count: online_count }) }}
                </h1>
            </td>
        </tr>
    </table>
    <table class="infotable">
        <tr
            :title="
                this.altv_data['version'] == cdn_data['version']
                    ? $t('header.tooltips.altv_version_1')
                    : $t('header.tooltips.altv_version_2', {
                          version: cdn_data['version'],
                      })
            "
        >
            <td>
                <a
                    href="https://altv.mp"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    {{ $t("header.altv_head_version") }}
                </a>
            </td>
            <td>
                {{
                    this.altv_data["version"] == cdn_data["version"]
                        ? `${this.altv_data["version"]} ✔️`
                        : `${this.altv_data["version"]} ⬆️`
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
                {{ this.altv_data["players"] }}/{{
                    this.altv_data["maxPlayers"]
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
import api from "../mixins/api.js"

export default {
    name: "PageHeader",
    setup() {
        const { locale, t } = useI18n({
            inheritLocale: true,
        })

        return { locale, t }
    },
    props: {
        viewers: Number,
        online_count: Number,
    },
    components: {},
    data() {
        return {
            active: false,
            lastupdate: this.$t("header.last_update_never"),
            cdn_data: {},
            timer: null,
            altv_data: {},
        }
    },
    async created() {
        this.fetch_altv()
        this.fetch_altv_server()
    },
    methods: {
        async fetch_altv_server() {
            const cdn_data = await api.fetch_or_cache(
                "https://cdn.altv.mp/server/release/x64_linux/update.json",
                "altv_server"
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

            if (api_data == undefined) {
                return
            }

            if (api_data["active"]) {
                this.altv_data = api_data["info"]
                this.active = api_data["active"]
            }
        },
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
