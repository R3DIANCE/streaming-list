import fetch from 'node-fetch';

export default async function handler(request, response) {
  const res = await fetch(process.env.SEARCH_SERVER);
  const data = await res.json();
  const info = JSON.stringify(data);
  return new Response(info, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
      "Content-Type": "application/json",
      "Cache-Control": "max-age=120"
    },
    status: 200,
  });
}
