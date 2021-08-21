import React from 'react';
import axios from 'axios';
import Bound from 'bounds.js';
import moment from 'moment';

class Streamers extends React.PureComponent {
  constructor() {
		super();
    //this.twitchloginurl = "https://id.twitch.tv/oauth2/authorize?client_id=mlk8sfol2tf0cfdsfjk31pepd4yh6i&redirect_uri=http://localhost:3000/login&response_type=token";
    this.twitchloginurl = "https://id.twitch.tv/oauth2/authorize?client_id=mlk8sfol2tf0cfdsfjk31pepd4yh6i&redirect_uri=https://luckyv.nickwasused.eu/login&response_type=token";
    this.altvserverid = "bb7228a0d366fc575a5682a99359424f";
    this.altvserverid2 = "998";
    this.searchquery = "luckyv";
    this.neededgameid = 32982;
    this.clientidbase64 = "bWxrOHNmb2wydGYwY2Zkc2ZqazMxcGVwZDR5aDZp";
		this.boundary = Bound();
    this.whenImageEnters = (image) => {
			return () => {
				image.src = image.dataset.src
				this.boundary.unWatch(image)
			}
		} 
	}
  
  state = {
    streamers: [],
    streams: [],
    server: [],
    inputValue: '',
    lastupdate: ''
  }

  FilterOnChange = (event) => {
    this.setState({
      inputValue: event.target.value
    })
  }
  
  async componentDidUpdate() {
    const images = document.querySelectorAll('img')
    images.forEach(image => {
      this.boundary.watch(image, this.whenImageEnters(image))
    })
    document.title = "Nickwasused`s Streamer Liste";
  }

  async writenewdata() {
    console.log("writing new data");
    const token = localStorage.getItem("token");
    const [streamers, servers] = await Promise.all([
      axios.get(`https://api.twitch.tv/helix/search/channels?query=${this.searchquery}&first=100&live_only=true`, {
        headers: { 'client-id': Buffer.from(this.clientidbase64, 'base64').toString('ascii'), 'Authorization': 'Bearer ' + token }
      }),
      axios.get(`https://api.altv.mp/server/${this.altvserverid}`, {
        headers: { 'accept': 'application/json' }
      })
    ]);


    localStorage.setItem("streamers", JSON.stringify(streamers.data.data))
    localStorage.setItem("server", JSON.stringify(servers.data))

    streamers.data.data.filter((streamer) => {
      let {id, display_name} = streamer
      localStorage.setItem('streamer:id:'+display_name, id);
    })

    let date = new Date();
    date.setHours(date.getHours(),date.getMinutes()+2.5,0,0);
    localStorage.setItem("invaliddata:streamers", date);
    this.setState({
      streamers: streamers.data.data,
      server: servers.data,
      lastupdate: date
    });
    this.getStreamData();
  }

  async loaddata() {
    console.log("loading data from localstorage");
    await this.setState({
      streamers: JSON.parse(localStorage.getItem("streamers")),
      server: JSON.parse(localStorage.getItem("server")),
      lastupdate: localStorage.getItem("invaliddata:streamers")
    });
    this.getStreamData();
  }

  async getStreamData() {
    const token = localStorage.getItem("token");
    let idstring = "";

    this.state.streamers.map(item => {
      console.log(item.title, item.game_id, item.is_live)
      if (item.title.match(/luckyv|lucky v/gi) && item.game_id == this.neededgameid && item.is_live === true) {
        idstring = idstring + "user_id=" + item.id + "&";
      }
    });

    const [streams] = await Promise.all([
      axios.get(`https://api.twitch.tv/helix/streams?first=100&${idstring}`, {
        headers: { 'client-id': Buffer.from(this.clientidbase64, 'base64').toString('ascii'), 'Authorization': 'Bearer ' + token }
      })
    ]);

    this.setState({
      streams: streams.data.data
    });
  }

  async getData() {
    if (!localStorage.getItem('streamers') && !localStorage.getItem('servers') && !localStorage.getItem('teamdata') && !localStorage.getItem('invaliddata:streamers')) {
      this.writenewdata();
    } else {
      const dateLimit = moment(localStorage.getItem("invaliddata:streamers"));
      const now = moment();
      if (dateLimit.isValid() && now.isAfter(dateLimit)) {
        console.log("data is invalid");
        localStorage.removeItem("streamers");
        localStorage.removeItem("server");
        localStorage.removeItem("invaliddata:streamers");
        this.writenewdata();
      } else {
        this.loaddata();
      }
    } 
  }

  logout() {
    localStorage.removeItem("token");
  }

  async componentDidMount() {
    this.interval = setInterval(this.getData.bind(this), 300000); // refresh data every 5 minutes (300000)
    if (localStorage.getItem("token") !== undefined && localStorage.getItem("token") != null) {
      this.getData();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let filteredstreamers = this.state.streams.filter((stream) => {
      let {title, game_id, type, user_name} = stream;
      if (title.match(/luckyv|lucky v/gi) && game_id == this.neededgameid && type === "live") { // && channel.language == "de"
        return user_name.toLowerCase().includes(this.state.inputValue.toLocaleLowerCase()) || title.toLowerCase().includes(this.state.inputValue.toLocaleLowerCase())
      }
    })
    
    let {active, info} = this.state.server;
    let date = moment(this.state.lastupdate).toDate();
    date.setHours(date.getHours(),date.getMinutes()-2.5,0,0);
    let datestring = moment(date).format('HH:mm');
    const last_update = datestring;

    return (
      <div>
        <div class="head">
          <a name="#top"></a>
          <h1>Streamer Online: { filteredstreamers.length }</h1>
          <a href={info ? `https://${info.website}`:``} rel="noreferrer" target="_blank"><h2>{info ? info.name:``}</h2></a>
          <a href={`https://altstats.net/server/${this.altvserverid2}`} rel="noreferrer" target="_blank"><div>Gameserver: {active ? 'Online':'Offline'}</div></a>
          <div>alt:V Version: {active ? info.version:""}</div>
          <div>Spieler Online: {info ? info.players:""}/{info ? info.maxPlayers:""}</div>
          <div>Zuletzt aktualisiert: {`${last_update} Uhr`}</div>
          {localStorage.getItem("token") === null ? <a href={this.twitchloginurl}><button>Login to Twitch</button></a>:<a href={this.logout}><button>Logout</button></a>}
          <div class="shareicon">
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://luckyv.nickwasused.eu" rel="noreferrer" target="_blank"><i class="fa fa-linkedin"></i></a>
            <a href="https://twitter.com/intent/tweet?text=Schaue hier: https://luckyv.nickwasused.eu wer auf https://luckyv.de Online ist! %23LuckyV" rel="noreferrer" target="_blank"><i class="fa fa-twitter"></i></a>
            <a href="https://reddit.com/submit?url=https://luckyv.nickwasused.eu&title=Schaue wer auf https://luckyv.de Online ist!" rel="noreferrer" target="_blank"><i class="fa fa-reddit"></i></a>
          </div><br />
          <input type="text" placeholder="Streamer, Streamtitel ..." value={this.inputValue} onChange={this.FilterOnChange}/>
        </div>
        <ul class="cards">
          {
            filteredstreamers.map((stream) => {
              const {id, user_id, user_name, user_login, title, thumbnail_url, viewer_count, started_at} = stream;
              const date = new Date().getTime();
              
              return (
                <li class="cards__item" key={id}>
                  <a href={"/streamer/" + user_login + "/" + user_id} rel="noreferrer">
                  <div class="card">
                  <div class="card__image"><img width="640px" height="340px" src="/img/placeholder.webp" data-src={`${thumbnail_url.replace("{width}", "640").replace("{height}", "360")}?${date}`} alt={user_name} referrerPolicy="same-origin"></img>
                  <div class="text-block">{user_name} <i class="fa fa-twitch"></i></div></div>
		                <div class="card__content">
			                <p class="card__text">
				                {title}<br />
                        Zuschauer: {viewer_count}<br />
                        Live seit: {new Date(started_at).toTimeString()}<br />
			                </p>
		                  </div>
	                  </div>
                  </a>
                </li>
              )
            })
          }
        </ul>
        <div class="note">Nickwasused {(new Date().getFullYear())} | We &#128155; LuckyV<br /><a href="#top">Nach oben</a></div>
      </div>
      )
    }
  } export default React.memo(Streamers);