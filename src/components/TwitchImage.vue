<template>
    <div v-lazyload class="card-image">
        <img
            width="640px"
            height="340px"
            src="/img/site/placeholder.webp"
            :data-url="
                'https://external-content.duckduckgo.com/iu/?u=' +
                this.stream['thumbnail_url']
                    .replace('{width}', '640')
                    .replace('{height}', '360') +
                '?cache-key=' +
                this.cachekey
            "
            :alt="stream['user_name']"
            referrerPolicy="same-origin"
        />
        <div class="card-text-block">
            {{ stream["user_name"] }}
            <img class="twitch" src="/img/site/twitch.svg" />
        </div>
    </div>
</template>

<script>
export default {
    name: "TwitchImage",
    props: {
        stream: {
            required: true,
        },
        cachekey: {
            required: true,
        },
    },
}
</script>

<style scoped lang="scss">
@import "../assets/TwitchImage.scss";
</style>
