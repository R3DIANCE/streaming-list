export async function onRequestGet({ params }) {
    const res = await fetch(`https://twitch-search-server.nickwasused.com/search?title=luckyv,lucky v`);
    const data = await res.json();
    return new Response(data);
}
  