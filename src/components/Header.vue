<template>
    <table class="maintable">
        <tr>
            <td>
                <h1 :title="$t('header.tooltips.streamer', { streamer_count: online_count })">{{ $t("header.streamer_head", { count: online_count })}}</h1>
            </td>
        </tr>
    </table>
    <table class="infotable">
        <tr :title="version == cdn_data['version'] ? $t('header.tooltips.altv_version_1'):$t('header.tooltips.altv_version_2', { version: cdn_data['version'] })">
            <td>
                <a
                    href="https://altv.mp"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    {{ $t("header.altv_head_version") }}
                </a>
            </td>
            <td>{{version == cdn_data["version"] ? `${version} ✔️`:`${version} ⬆️`}}</td>
        </tr>
        <tr :title="active ? $t('header.tooltips.gameserver_1'):$t('header.tooltips.gameserver_2')">
            <td>
                <a
                    href="https://altstats.net/server/"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    {{ $t("header.game_server_head") }}
                </a>
            </td>
            <td>{{active ? "Online ✔️":"Offline ❌"}}</td>
        </tr>
        <tr :title="active ? $t('header.tooltips.players', { player: players }):''">
            <td>{{ $t("header.players_online_head") }}</td>
            <td>{{players}}/{{maxplayers}}</td>
        </tr>
        <tr :title="$t('header.tooltips.viewer', { viewer: viewers })">
            <td>{{ $t("header.viewers_head") }}</td>
            <td>{{viewers}}</td>
        </tr>
        <tr :title="$t('header.tooltips.refresh')">
            <td>{{ $t("header.last_refresh_head") }}</td>
            <td>{{lastupdate}}</td>
        </tr>
    </table>
</template>

<script>
    import { useI18n } from 'vue-i18n';
    import moment from 'moment';
    // https://pieroxy.net/blog/pages/lz-string/demo.html
    import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

    export default {
        name: "Header",
        setup() {
            const { locale, t } = useI18n({
                inheritLocale: true
            })

            return { locale, t }
        },
        props: {
            viewers: Number,
            online_count: Number
        },
        components: {},
        data() {
            return {
                active: false,
                players: 0,
                maxplayers: 0,
                version: 0,
                lastupdate: this.$t("header.last_update_never"),
                cdn_data: {},
                timer: null
            }
        },
        async created() {
            let now = new Date();
            if (localStorage.getItem("altv") && now < new Date(localStorage.getItem("altv:invalidate"))) {
                // use old data
                console.log("using cached data: alt:V");
                await this.fetch_altv(localStorage.getItem("altv"));
            } else {
                // fetch new data
                console.log("fetching new data: alt:V");
                await this.fetch_altv();
            }
            if (localStorage.getItem("altv_server") && now < new Date(localStorage.getItem("altv_server:invalidate"))) {
                // use old data
                console.log("using cached data: alt:V Server");
                await this.fetch_altv_server(localStorage.getItem("altv_server"));
            } else {
                // fetch new data
                console.log("fetching new data: alt:V Server");
                await this.fetch_altv_server();
            }
        },
        methods: {
            async fetch_altv_server(data) {
                const data_url = `https://cdn.altv.mp/server/release/x64_linux/update.json`;
                let cdn_data = {};
                if (!data) {
                    try {
                        const response = await fetch(data_url);
                        cdn_data = await response.json();
                        if (cdn_data == undefined) {
                            cdn_data = JSON.parse(decompressFromUTF16(localStorage.getItem("altv_server")));
                        }
                    } catch (Exception) {
                        console.error(Exception);
                        cdn_data = [];
                    } 
                } else {
                    cdn_data = JSON.parse(decompressFromUTF16(localStorage.getItem("altv_server")));
                }

                this.cdn_data = cdn_data;

                let invalid_date = new Date();
                invalid_date.setMinutes(invalid_date.getMinutes() + 2);
                localStorage.setItem("altv_server:invalidate", invalid_date);
                localStorage.setItem("altv_server", compressToUTF16(JSON.stringify(cdn_data)));
            },
            async fetch_altv(data) {
                let url = import.meta.env.VERCEL_ENV == "production" ? "/api/altv":`https://api.altv.mp/server/${import.meta.env.VITE_ALTV_SERVER_ID}`;
                let api_data = [];
                if (!data) {
                    try {
                        const response = await fetch(url);
                        api_data = await response.json();
                        if (api_data == undefined) {
                            api_data = JSON.parse(decompressFromUTF16(localStorage.getItem("altv")));
                        }
                    } catch (Exception) {
                        console.error(Exception);
                        api_data = [];
                    } 
                } else {
                    api_data = JSON.parse(decompressFromUTF16(localStorage.getItem("altv")));
                }
                
                this.lastupdate = `${moment().format("H:m")} Uhr`;

                if (api_data["active"]) {
                    this.active = api_data["active"];
                    this.players = api_data["info"]["players"];
                    this.maxplayers = api_data["info"]["maxPlayers"];
                    this.version = api_data["info"]["version"];
                    let invalid_date = new Date();
                    invalid_date.setMinutes(invalid_date.getMinutes() + 2);
                    localStorage.setItem("altv:invalidate", invalid_date);
                    localStorage.setItem("altv", compressToUTF16(JSON.stringify(api_data)));
                }
            }
        },
        mounted: function () {
            if (this.timer == null) {
                this.timer = setInterval(() => {
                    this.fetch_altv();
                    this.fetch_altv_server();
                }, 120000)
            }
        },
        unmounted() {
            clearInterval(this.timer)
        }
    }
</script>

<style scoped>
    @import '../assets/header.css';
</style>