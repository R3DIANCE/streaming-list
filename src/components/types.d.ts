interface Streamer {
    user_id: number
    user_name: string
    title: string
    viewer_count: number
    started_at: string
    thumbnail_url: string
}

interface Server {
    bannerUrl: null | string
    branch: string
    build: number
    cdnUrl: string
    description: string
    earlyAuthUrl: string
    gameMode: string
    host: string
    id: string
    language: string
    lastUpdate: number
    locked: boolean
    maxPlayers: number
    name: string
    players: number
    port: number
    promoted: boolean
    tags: Array<string>
    useCdn: boolean
    useEarlyAuth: boolean
    useVoiceChat: boolean
    verified: boolean
    version: string
    website: string
}
