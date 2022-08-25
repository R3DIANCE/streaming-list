<template>
    <div v-lazyload class="card-image">
        <img
            width="640px"
            height="340px"
            src="/img/site/placeholder.webp"
            :data-url="
                'https://external-content.duckduckgo.com/iu/?u=' +
                this.thumbnail_url
                    .replace('{width}', '640')
                    .replace('{height}', '360') +
                '?cache-key=' +
                this.cachekey
            "
            :alt="this.user_name"
            referrerPolicy="same-origin"
        />
        <div class="card-text-block">
            {{ this.user_name }}
            <img class="twitch" src="/img/site/twitch.svg" />
        </div>
        <img
            v-once
            v-if="mouseover"
            class="external"
            src="../../public/img/site/external.svg"
        />
    </div>
</template>

<script>
export default {
    name: "TwitchImage",
    props: {
        thumbnail_url: {
            required: true,
        },
        user_name: {
            required: true,
        },
        cachekey: {
            required: true,
        },
        mouseover: {
            required: true,
        },
    },
}
</script>

<style scoped lang="scss">
@import "../assets/TwitchImage.scss";
</style>
