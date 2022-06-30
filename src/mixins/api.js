import { compressToUTF16, decompressFromUTF16 } from "lz-string"

const api = {
    // https://pieroxy.net/blog/pages/lz-string/demo.html
    async fetch_or_cache(url, key) {
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
                let invalid_date = new Date()
                invalid_date.setMinutes(invalid_date.getMinutes() + 2)
                localStorage[`${key}:invalidate`] = invalid_date
                localStorage[key] = compressToUTF16(JSON.stringify(api_data))
            } catch (Exception) {
                console.error(Exception)
                api_data = undefined
            }
        } else {
            // load data from cache
            console.debug(`using cached data for: ${key}`)
            api_data = JSON.parse(decompressFromUTF16(localStorage[key]))
        }

        return api_data
    },
}

export default api
