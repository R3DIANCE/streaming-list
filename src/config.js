export const config = {
    "website": {
        "url": window.location.href,
        "title": "Nickwasused`s Streamer Liste",
        "footer_text": "We &#128155; LuckyV",
        "author": "Nickwasused"
    },
    "target": {
        "website": "https://luckyv.de",
        "name": "LuckyV"
    },
    "search": {
        "term": "luckyv",
        "regex": "luckyv|lucky v|lucky-v",
        "game_id": "32982",
        "language": "de"
    },
    "altv": {
        "longid": "bb7228a0d366fc575a5682a99359424f",
        "intid": "998"
    },
    "twitch": {
        "loginurl": `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(`${window.location.href}login`)}`,
        "clientid": process.env.REACT_APP_TWITCH_CLIENT_ID
    },
    "time": {
        "refresh_data": 5,
        "streams_data_cache": 2.5,
        "stream_info_cache": 60,
        "refresh_dates": 1
    },
    "settings": {
        "shareicons": true,
        "minviewers": 0,
        "maxviewers": 50000,
        "imageproxy": true,
        "imageproxyurl": "https://image-proxy.nickwasused.com/api/getimage?imageurl="
    },
    "dates": [
        { 
            "description": "Zeit seit dem ersten Stresstest",
            "date": "Sun Mar 29 2020 19:30:00"
        },
        { 
            "description": "Zeit seit dem zweiten Stresstest",
            "date": "Sun Apr 19 2020 19:00:00"
        },
        { 
            "description": "Zeit seit dem ihr euren Charakter erstellen könnt",
            "date": "Fri May 8 2020 18:00:00"
        },
        { 
            "description": "Zeit seit dem Server Release",
            "date": "Fri May 22 2020 18:00:00"
        },
        { 
            "description": "Zeit seit dem Venture Release",
            "date": "Sun Aug 09 2020 18:00:00"
        },
        { 
            "description": "Zeit seit dem ersten State Prison Event",
            "date": "Sat Sep 26 2020 19:00:00"
        },
        { 
            "description": "Zeit seit dem Projekt split",
            "date": "Thu Mar 12 2021 16:00:00"
        },
        { 
            "description": "Zeit seit dem LuckyV Merch Shop",
            "date": "Fri Sep 3 2021 18:00:00"
        }
    ]
}

export default config;