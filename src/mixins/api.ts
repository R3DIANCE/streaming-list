const api = {
    async fetch_or_cache(url: string, key: string, minuets: number = 2) {
        // we want to fetch data either from localstorage or from a remote server with a certain cache that we can set ourself e.g. for the alt:V CDN data
        let now = new Date()
        let api_data

        const local_item = localStorage.getItem(key)

        if (
            local_item == undefined ||
            now > new Date(JSON.parse(local_item)["invalid_at"])
        ) {
            // fetch new data
            console.debug(`fetching new data for: ${key}`)
            try {
                const response = await fetch(url)
                api_data = await response.json()

                // set data to localstorage and set invaliddate
                now.setMinutes(now.getMinutes() + minuets)
                const save_item = {
                    invalid_at: now,
                    saved_data: api_data,
                }
                localStorage.setItem(key, JSON.stringify(save_item))
            } catch (error) {
                console.warn(
                    `error while fetching resource: ${url}, ${key} ${error}`
                )
                if (local_item == undefined) {
                    return {}
                } else {
                    return JSON.parse(local_item)["saved_data"]
                }
            }
        } else {
            // load data from cache
            console.debug(`using cached data for: ${key}`)
            api_data = JSON.parse(local_item)["saved_data"]
        }

        return api_data
    },
}

export default api
