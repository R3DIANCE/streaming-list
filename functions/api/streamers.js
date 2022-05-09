export async function onRequestGet({ params }) {
    const res = await fetch(`https://twitch-search-server.nickwasused.com/search?title=luckyv,lucky v`);
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
  