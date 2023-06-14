<template>
  <PageHeader :viewer_count="viewer_count" :streamer_count="streamer_count" />
  <StreamerList :streamers="streamers" />
</template>

<script setup>
import { computed } from "vue";
import PageHeader from "./components/PageHeader.vue";
import StreamerList from "./components/StreamerList.vue";
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'

const { result, loading, error, refetch } = useQuery(gql`
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
const streamer_count = streamers.lenght;
</script>

<style lang="scss">
@import "./assets/app.scss";
</style>
