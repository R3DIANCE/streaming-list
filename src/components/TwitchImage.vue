<template>
  <div
    v-lazyload
    class="card-image"
  >
    <img
      width="640px"
      height="340px"
      src="../assets/img/site/placeholder.webp"
      srcset=""
      :data-srcset="`${thumbnailUrl.replace('{width}', '320').replace('{height}', '180')}?cache-key=${cacheKey} 895w, ` + `${thumbnailUrl.replace('{width}', '640').replace('{height}', '360')}?cache-key=${cacheKey} 896w, `"
      :alt="userName"
      referrerPolicy="same-origin"
      crossorigin="anonymous"
      sizes="(max-width: 640px) 15vw, (max-width: 320px) 10vw"
    >
    <div
      v-once
      class="card-text-block"
    >
      {{ userName }}
      <img
        class="twitch"
        alt="twitch logo"
        src="../assets/img/site/twitch.svg"
      >
    </div>
    <img
      v-if="mouseOver"
      class="external"
      src="../assets/img/site/external.svg"
    >
  </div>
</template>

<script>
export default {
    name: "TwitchImage",
    props: {
        thumbnailUrl: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        cacheKey: {
            type: String,
            required: true,
        },
        mouseOver: {
            type: Boolean,
            required: true,
        },
    },
};
</script>

<style scoped lang="scss">
@import "../assets/TwitchImage.scss";
</style>
