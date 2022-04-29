<template>
    <li class="cards_item">
        <a :href="'https://twitch.tv/' + stream['user_name']" target="_blank">
            <div class="card">
                <div class="cardimage">
                    <img
                        width="640px"
                        height="340px"
                        :src="stream['thumbnail_url'].replace('{width}', '640').replace('{height}', '360')"
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
                        {{stream["title"]}}
                        <br />
                        Zuschauer: {{stream["viewer_count"]}}
                        <br />
                        Live seit:
                        {{time}}
                        <br />
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
        props: {
            stream: Object,
        },
        data() {
            return {
                "time": ""
            }
        },
        created() {
            this.time = this.calculate_time(this.stream["started_at"]);
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
            }
        }
    }
</script>

<style scoped>
    .cards_item {
        display: flex;
        padding: 1rem;
    }

    .card {
        background-color: #fcd401;
        color: black;
        border-radius: 0px 0px 0.5rem 0.5rem;
        box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: all 0.3s linear;
    }

    .card:hover {
        color: white;
        background-color: black;
    }

    .cardimage {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        filter: contrast(70%);
        overflow: hidden;
        position: relative;
        transition: filter 0.5s cubic-bezier(0.43, 0.41, 0.22, 0.91);
    }

    .cardtitle {
        font-size: 1.25rem;
        font-weight: 300;
        letter-spacing: 2px;
        text-transform: uppercase;
    }

    .cardtext {
        flex: 1 1 auto;
        font-size: 0.875rem;
        line-height: 1.5;
        margin-bottom: 1.25rem;
    }

    .cardcontent {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        padding: 1rem;
    }

    .textblock {
        position: absolute;
        bottom: 5%;
        right: 5%;
        background-color: black;
        color: white;
        padding-left: 5%;
        padding-right: 5%;
        font-size: 1.5em;
    }

    @media (min-width: 40rem) {
        .cards_item {
            width: 50%;
        }
    }

    @media (min-width: 56rem) {
        .cards_item {
            width: 33.3333%;
        }
    }
</style>