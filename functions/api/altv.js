export async function onRequestGet({ params, env }) {
    const init = {
        cf: {
          cacheTtl: 120,
          cacheEverything: true,
        },
    };
    const res = await fetch(`https://api.altv.mp/server/${env.ALTV_SERVER_ID}`, init);
    const data = await res.json();
    const info = JSON.stringify(data);
    return new Response(info, {
        headers: {
          // add your origin here
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
          "Content-Type": "application/json",
          "Cache-Control": "max-age=120"
        },
        status: 200,
    });
}