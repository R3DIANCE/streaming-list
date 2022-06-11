<template>
    <li class="cards_item">
        <a :href="'https://twitch.tv/' + stream['user_name']" target="_blank" rel="noopener noreferrer">
            <div class="card">
                <Image :stream="this.stream" :cachekey="this.cachekey" />
                <div class="cardcontent">
                    <p class="cardtext">
                        <p class="card_item">{{stream["title"]}}</p>
                        <table class="streamertable">
                            <tr :title="$t('streamer.tooltips.viewer', { user: stream['user_name'], viewer: stream['viewer_count'] })">
                                <td>{{ $t("streamer.viewer_count") }}</td>
                                <td>{{stream["viewer_count"]}}</td>
                            </tr>
                            <tr :title="$t('streamer.tooltips.live_since', { user: stream['user_name'], time: new Date(stream['started_at']).toLocaleTimeString(), total_time: calculate_time })">
                                <td>{{ $t("streamer.live_since") }}</td>
                                <td>{{calculate_time}}</td>
                            </tr>
                        </table>
                    </p>
                </div>
            </div>
        </a>
    </li>
</template>

<script>
    import { useI18n } from 'vue-i18n';
    import Image from './Image.vue';
    
    export default {
        name: "Streamer",
        setup() {
            const { locale, t } = useI18n({
                inheritLocale: true
            })

            return { locale, t }
        },
        components: {
            Image
        },
        props: {
            stream: Object,
            cachekey: String
        },
        computed: {
            calculate_time() {
                // Stream runtime calculation
                let startDate = new Date(this.stream["started_at"]);
                let timeEnd = new Date();
                let diff = timeEnd - startDate;
                let utcdate = new Date(diff).toLocaleTimeString("de", {timeZone: "UTC"});
                return utcdate;
            }
        }
    }
</script>

<style scoped>
    @import '../assets/streamer.css';
</style>