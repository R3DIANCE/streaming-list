import fetch from 'node-fetch';

export default async function handler(request, response) {
  const res = await fetch(process.env.SEARCH_SERVER);
  const data = await res.json();
  const info = JSON.stringify(data);
  res.setHeader('Access-Control-Allow-Origin', process.env.VERCEL_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=120');
  return response.status(200).json({ info });
}
