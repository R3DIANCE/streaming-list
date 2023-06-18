<template>
  <PageHeader
    :viewer_count="viewer_count"
    :streamer_count="streamers.length"
  />
  <StreamerList
    :streamers="streamers"
  />
  <div v-if="gql_error">
    {{ gql_error }}
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import PageHeader from "./components/PageHeader.vue";
import StreamerList from "./components/StreamerList.vue";
import { useQuery } from 'villus';

const gql_error = ref(null);
const timer = ref(null);
const QUERY = `
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
`;

const { data, execute, onError } = useQuery({
  query: QUERY,
});

onError(error => {
  console.error(error);
  gql_error.value = error;
})

const viewer_count = computed(() => data.value?.getViewerCount ?? 0);
const streamers = computed(() => data.value?.Streamers ?? []);

onMounted(() => {
    if (timer.value == null) {
        timer.value = setInterval(() => {
            execute();
            imgcachekey.value = Math.random().toString().substring(2, 8);
        }, 300000);
    }
});

onUnmounted(() => {
    clearInterval(timer.value);
});
</script>

<style lang="scss">
@import "./assets/app.scss";
</style>
