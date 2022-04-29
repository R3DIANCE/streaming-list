<template>
    <a class="anchor" href="/#" name="#top">
        Top
    </a>
    <table class="maintable">
        <tr>
            <td>
                <h1>Streamer Online: {{online_count}}</h1>
            </td>
        </tr>
    </table>
    <table>
        <tr>
            <td>
                <a
                    href="https://altv.mp"
                    rel="noreferrer"
                    target="_blank"
                >
                    alt:V Version:
                </a>
            </td>
            <td>{{version}}</td>
        </tr>
        <tr>
            <td>
                <a
                    href="https://altstats.net/server/"
                    rel="noreferrer"
                    target="_blank"
                >
                    Gameserver:
                </a>
            </td>
            <td>{{active}}</td>
        </tr>
        <tr>
            <td>Spieler Online:</td>
            <td>
                {{players}}/{{maxplayers}}
            </td>
        </tr>
        <tr>
            <td>Zuschauer insgesamt:</td>
            <td>
                {{viewers}}
            </td>
        </tr>
        <tr>
            <td>Zuletzt aktualisiert:</td>
            <td>{{lastupdate}} Uhr</td>
        </tr>
    </table>
</template>

<script>
    import moment from 'moment';

    export default {
        name: "Header",
        props: {
            viewers: Number,
            online_count: Number
        },
        components: {},
        data() {
            return {
                "active": false,
                "players": 0,
                "maxplayers": 0,
                "version": 0,
                "lastupdate": "Never"
            }
        },
        async created() {
            await this.fetch_altv();
        },
        methods: {
            async fetch_altv() {
                const response = await fetch("https://api.altv.mp/server/bb7228a0d366fc575a5682a99359424f");
                const api_data = await response.json();

                this.lastupdate = moment().format("H:m");

                if (api_data["active"]) {
                    this.active = api_data["active"];
                    this.players = api_data["info"]["players"];
                    this.maxplayers = api_data["info"]["maxPlayers"];
                    this.version = api_data["info"]["version"];
                }
            }
        }
    }
</script>

<style scoped>
    @import '../assets/header.css';
</style>