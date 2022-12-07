<template>
  <div
    v-lazyload
    class="card-image"
  >
    <img
      width="640px"
      height="340px"
      src="../assets/img/site/placeholder.webp"
      :data-url="
        thumbnail_url
          .replace('{width}', '640')
          .replace('{height}', '360') +
          '?cache-key=' +
          cachekey
      "
      :alt="user_name"
      referrerPolicy="same-origin"
      crossorigin="anonymous"
    >
    <div
      v-once
      class="card-text-block"
    >
      {{ user_name }}
      <img
        class="twitch"
        alt="twitch logo"
        src="../assets/img/site/twitch.svg"
      >
    </div>
    <img
      v-if="mouseover"
      class="external"
      src="../assets/img/site/external.svg"
    >
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
};
</script>

<style scoped lang="scss">
@import "../assets/TwitchImage.scss";
</style>
