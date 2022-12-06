const api = {
    async fetch_or_cache(url, key, minuets = 2) {
        let now = new Date();
        let api_data;

        const local_item = localStorage.getItem(key);

        if (
            local_item == undefined ||
            localStorage.getItem(`${key}:invalidate`) == undefined ||
            now > new Date(localStorage[`${key}:invalidate`])
        ) {
            // fetch new data
            console.debug(`fetching new data for: ${key}`);
            try {
                const response = await fetch(url);
                api_data = await response.json();

                // set data to localstorage and set invaliddate
                now.setMinutes(now.getMinutes() + minuets);
                localStorage.setItem(`${key}:invalidate`, now);
                localStorage.setItem(key, JSON.stringify(api_data));
            } catch (error) {
                console.warn(`error while fetching resource: ${error}`)
                if (local_item == undefined) {
                    return {}
                } else {
                    return JSON.parse(local_item);
                }
            }
        } else {
            // load data from cache
            console.debug(`using cached data for: ${key}`);
            api_data = JSON.parse(local_item);
        }

        return api_data
    },
}

export default api
