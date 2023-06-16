<template>
  <PageHeader
    :viewer_count="viewer_count"
    :streamer_count="streamers.length"
  />
  <StreamerList
    :streamers="streamers"
  />
  <div v-if="error">
    {{ error }}
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import PageHeader from "./components/PageHeader.vue";
import StreamerList from "./components/StreamerList.vue";
import gql from 'graphql-tag';
import { useQuery } from '@vue/apollo-composable';

const timer = ref(null);
const { result, error, refetch } = useQuery(gql`
  query {
    getViewerCount(title: "luckyv,lucky v")
    Streamers(title: "luckyv,lucky v") {
      user_id
      user_name
      title
      viewer_count
      started_at
      thumbnail_url
    }
  }
`);

const viewer_count = computed(() => result.value?.getViewerCount ?? 0);
const streamers = computed(() => result.value?.Streamers ?? []);

onMounted(() => {
    if (timer.value == null) {
        timer.value = setInterval(() => {
            refetch();
            imgcachekey.value = Math.random().toString().substring(2, 8);
        }, 300000);
    }
});

onUnmounted(() => {
    clearInterval(timer.value);
    window.removeEventListener("resize", window_resize);
});
</script>

<style lang="scss">
@import "./assets/app.scss";
</style>
