export async function onRequestGet({ params }) {
    const init = {
        cf: {
          cacheTtl: 60,
          cacheEverything: true,
        },
    };
    const res = await fetch(env.SEARCH_SERVER, init);
    const data = await res.json();
    const info = JSON.stringify(data);
    return new Response(info, {
        headers: {
          // add your origin here
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
          "Content-Type": "application/json",
          "Cache-Control": "max-age=60"
        },
        status: 200,
    });
}