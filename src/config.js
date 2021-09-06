export const config = {
    "website": {
        "url": window.location.href,
        "title": "Nickwasused`s Streamer Liste",
        "footer_text": "We &#128155; LuckyV",
        "author": "Nickwasused",
        "server_launch": "Fri May 22 2020 18:00:00"
    },
    "target": {
        "website": "https://luckyv.de",
        "name": "LuckyV"
    },
    "search": {
        "term": "luckyv",
        "regex": "luckyv|lucky v",
        "game_id": "32982",
        "language": "de"
    },
    "altv": {
        "longid": "bb7228a0d366fc575a5682a99359424f",
        "intid": "998"
    },
    "twitch": {
        "loginurl": "https://id.twitch.tv/oauth2/authorize?client_id="+ process.env.REACT_APP_TWITCH_CLIENT_ID +"&redirect_uri="+ window.location.href +"login&response_type=token",
        "clientid": process.env.REACT_APP_TWITCH_CLIENT_ID
    },
    "time": {
        "refresh_data": 5,
        "streams_data_cache": 2.5,
        "stream_info_cache": 60
    },
    "settings": {
        "shareicons": true,
        "minviewers": 0,
        "maxviewers": 50000
    }
}

export default config;