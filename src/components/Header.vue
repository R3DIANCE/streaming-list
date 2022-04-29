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
            <td>{{lastupdate}}</td>
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
                active: false,
                players: 0,
                maxplayers: 0,
                version: 0,
                lastupdate: "Nie",
                timer: null
            }
        },
        async created() {
            let invalid_date = new Date(localStorage.getItem("altv:invalidate"))
            let now = new Date();
            if (localStorage.getItem("altv") && now < invalid_date) {
                // use old data
                console.log("using cached data: alt:V");
                await this.fetch_altv(localStorage.getItem("altv"));
            } else {
                // fetch new data
                console.log("fetching new data: alt:V");
                await this.fetch_altv();
            }
        },
        methods: {
            async fetch_altv(data) {
                let api_data = [];
                if (!data) {
                    try {
                        const response = await fetch(`https://api.altv.mp/server/${import.meta.env.VITE_ALTV_SERVER_ID}`);
                        api_data = await response.json();
                        if (api_data == undefined) {
                            api_data = JSON.parse(localStorage.getItem("altv"));
                        }
                    } catch (Exception) {
                        console.error(Exception);
                        api_data = [];
                    }
                    
                } else {
                    api_data = JSON.parse(localStorage.getItem("altv"));
                }
                
                this.lastupdate = `${moment().format("H:m")} Uhr`;

                if (api_data["active"]) {
                    this.active = api_data["active"];
                    this.players = api_data["info"]["players"];
                    this.maxplayers = api_data["info"]["maxPlayers"];
                    this.version = api_data["info"]["version"];
                    let invalid_date = new Date();
                    invalid_date.setMinutes(invalid_date.getMinutes() + 5);
                    localStorage.setItem("altv:invalidate", invalid_date);
                    localStorage.setItem("altv", JSON.stringify(api_data));
                }
            }
        },
        mounted: function () {
            if (this.timer == null) {
                this.timer = setInterval(() => {
                    this.fetch_altv()
                }, 300000)
            }
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>

<style scoped>
    @import '../assets/header.css';
</style>