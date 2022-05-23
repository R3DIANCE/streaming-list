<template>
    <li class="cards_item">
        <a :href="'https://twitch.tv/' + stream['user_name']" target="_blank" rel="noopener noreferrer">
            <div class="card">
                <div class="cardimage">
                    <img
                        width="640px"
                        height="340px"
                        class="lozad"
                        src="../assets/placeholder.jpg"
                        :data-loaded="this.cachekey"
                        :data-src="'https://external-content.duckduckgo.com/iu/?u=' + this.stream['thumbnail_url'].replace('{width}', '640').replace('{height}', '360') + '?key=' + this.cachekey"
                        :alt="stream['user_name']"
                        referrerPolicy="same-origin"
                    />
                    <div class="textblock">
                        {{stream["user_name"]}}
                        <i class="fa fa-twitch"></i>
                    </div>
                </div>
                <div class="cardcontent">
                    <p class="cardtext">
                        <p class="card_item">{{stream["title"]}}</p>
                        <table class="streamertable">
                            <tr>
                                <td>Zuschauer:</td>
                                <td>{{stream["viewer_count"]}}</td>
                            </tr>
                            <tr>
                                <td>Live seit:</td>
                                <td>{{time}}</td>
                            </tr>
                        </table>
                    </p>
                </div>
            </div>
        </a>
    </li>
</template>

<script>
    import moment from 'moment';
    
    export default {
        name: "Streamer",
        emits: ["observe"],
        props: {
            stream: Object,
            cachekey: String
        },
        data() {
            return {
                time: ""
            }
        },
        created() {
            this.time = this.calculate_time(this.stream["started_at"]);
        },
        mounted: function () {
            this.observe();
        },
        methods: {
            calculate_time(time) {
                // Stream runtime calculation
                const startDate = moment(time);
                const timeEnd = moment();
                const diff = timeEnd.diff(startDate);
                const diffDuration = moment.duration(diff);

                let hours = (diffDuration.hours());
                let minuets = (diffDuration.minutes());
                let seconds = (diffDuration.seconds());

                var tempdate = new Date();
                tempdate.setHours(hours, minuets, seconds);
                return tempdate.toLocaleTimeString();
            },
            observe() {
                this.$emit("observe");
            }
        }
    }
</script>

<style scoped>
    @import '../assets/streamer.css';
</style>