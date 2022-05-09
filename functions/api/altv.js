export async function onRequestGet({ params }) {
    const res = await fetch(`https://api.altv.mp/server/bb7228a0d366fc575a5682a99359424f`);
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