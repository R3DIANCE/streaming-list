const api = {
    // https://pieroxy.net/blog/pages/lz-string/demo.html
    async fetch_or_cache(url, key, minuets = 2) {
        let now = new Date()
        let api_data

        if (
            localStorage[key] == undefined ||
            localStorage[`${key}:invalidate`] == undefined ||
            now > new Date(localStorage[`${key}:invalidate`])
        ) {
            // fetch new data
            console.debug(`fetching new data for: ${key}`)
            try {
                const response = await fetch(url)
                api_data = await response.json()

                // set data to localstorage and set invaliddate
                now.setMinutes(now.getMinutes() + minuets)
                localStorage[`${key}:invalidate`] = now
                localStorage[key] = JSON.stringify(api_data)
            } catch (error) {
                console.warn(`error while fetching resource: ${error}`)
                return {}
            }
        } else {
            // load data from cache
            console.debug(`using cached data for: ${key}`)
            api_data = JSON.parse(localStorage[key])
        }

        return api_data
    },
}

export default api
