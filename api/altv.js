import fetch from 'node-fetch';

export default async function handler(request, response) {
  let data = {};
  try {
    const res = await fetch(`https://api.altv.mp/server/${process.env.VITE_ALTV_SERVER_ID}`, {
      headers: { 'User-Agent': 'AltPublicAgent' },
    });
    data = await res.json();
  } catch (e) {
    console.error(e);
  }
  
  response.setHeader('Access-Control-Allow-Origin', process.env.VERCEL_URL);
  response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 's-maxage=60');
  return response.status(200).json(data);
}
