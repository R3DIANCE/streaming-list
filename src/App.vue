<template>
    <PageHeader
        :viewer-count="viewer_count"
        :streamer-count="streamers.length"
    />
    <StreamerList :streamers="streamers" />
    <div v-if="gql_error">
        {{ gql_error }}
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue"
import PageHeader from "./components/PageHeader.vue"
import StreamerList from "./components/StreamerList.vue"
import { useQuery } from "villus"

const gql_error = ref(null)
const gql_timer = ref<number | null>(null)
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
`

const { data, execute, onError } = useQuery({
    query: QUERY,
})

onError((error) => {
    console.error(error)
    gql_error.value = error
})

const viewer_count = computed<number>(() => data.value?.getViewerCount ?? 0)
const streamers = computed<Array<Streamer>>(() => data.value?.Streamers ?? [])

onMounted(() => {
    if (gql_timer.value == null) {
        gql_timer.value = setInterval(() => {
            execute()
        }, 300000)
    }
})

onUnmounted(() => {
    if (gql_timer.value) {
        clearInterval(gql_timer.value)
    }
})
</script>

<style lang="scss">
@import "./assets/css/app.scss";
</style>
