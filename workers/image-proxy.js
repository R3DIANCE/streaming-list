addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event.request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    );
});

async function handleRequest(request) {
    const url = new URL(request.url);
    const { pathname } = url;
    const { searchParams } = url;

    if (pathname.startsWith("/api/getimage")) {
        let imageurl = searchParams.get("imageurl");

        const init = {
            cf: {
                cacheTtl: 120,
                cacheEverything: true,
            },
        };
        const response = await fetch(imageurl, init);
        return response;
    }

    if (pathname.startsWith("/api/ping")) {
        const { status } = {
            status: "pong",
        };
        return new Response(status, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
                "Access-Control-Max-Age": "86400",
                "Content-Type": "application/json",
                "Cache-Control": "max-age=120",
            },
            status: 200,
        });
    }

    const { status } = {
        status: "missing request",
    };
    return new Response(status, { status: 401 });
}
