<template>
  <div
    class="card-image"
  >
    <img
      v-lazyload
      width="640px"
      height="340px"
      src="../assets/img/site/placeholder.webp"
      srcset=""
      :data-srcset="`${thumbnailUrl.replace('{width}', '320').replace('{height}', '180')}?cache-key=${cacheKey} 320w, ` + `${thumbnailUrl.replace('{width}', '480').replace('{height}', '270')}?cache-key=${cacheKey} 480w, ` + `${thumbnailUrl.replace('{width}', '640').replace('{height}', '360')}?cache-key=${cacheKey} 640w`"
      :alt="userName"
      referrerPolicy="same-origin"
      crossorigin="anonymous"
      sizes="(min-width: 1400px) 100vw, (min-width: 1200px) 30vw, (min-width: 895px) 20vw, (min-width: 740px) 50vw, (min-width: 640px) 30vw, 100vw"
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

<script setup>
const props = defineProps({
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
});
</script>

<style scoped lang="scss">
@import "../assets/TwitchImage.scss";
</style>
