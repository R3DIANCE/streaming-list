addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event.request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    )
})

async function gatherResponse(response) {
    const { headers } = response
    const contentType = headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
        return response.text()
    } else if (contentType.includes("application/text")) {
        return response.text()
    } else if (contentType.includes("text/html")) {
        return response.text()
    } else {
        return response.text()
    }
}

async function handleRequest(request) {
    const url = new URL(request.url)
    const { pathname } = url
    const { searchParams } = url

    if (pathname.startsWith("/api/getserverbyid")) {
        let serverid = searchParams.get("serverid")

        const init = {
            cf: {
                cacheTtl: 120,
                cacheEverything: true,
            },
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        }
        const response = await fetch(
            `https://api.altv.mp/server/${serverid}`,
            init
        )
        const results = await gatherResponse(response)
        return new Response(results, {
            headers: {
                // add your origin here
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
                "Access-Control-Max-Age": "86400",
                "Content-Type": "application/json",
                "Cache-Control": "max-age=120",
            },
            status: 200,
        })
    }

    if (pathname.startsWith("/api/ping")) {
        const { status } = {
            status: "pong",
        }
        return new Response(status, {
            headers: {
                // add your origin here
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
                "Access-Control-Max-Age": "86400",
                "Content-Type": "application/json",
                "Cache-Control": "max-age=120",
            },
            status: 200,
        })
    }

    const { status } = {
        status: "missing request",
    }
    return new Response(status, { status: 401 })
}
