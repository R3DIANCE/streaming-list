import React from 'react';
import axios from 'axios';
import Bound from 'bounds.js';
import moment from 'moment';
import parse from "html-react-parser";
import { config } from '../config';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Streamers extends React.PureComponent {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
		super(props);
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
    token: this.props.cookies.get("token") || "",
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
    document.title = config.website.title;
  }

  async writenewdata() {
    console.log("writing new data");
    const token = this.state.token;

    let idstring = "";

    const [streamers, servers] = await Promise.all([
      axios.get(`https://api.twitch.tv/helix/search/channels?query=${config.search.term}&first=100&live_only=true`, {
        headers: { 'client-id': config.twitch.clientid, 'Authorization': 'Bearer ' + token }
      }),
      axios.get(`https://api.altv.mp/server/${config.altv.longid}`, {
        headers: { 'accept': 'application/json' }
      })
    ]);

    await streamers.data.data.map(item => {
      if (item.title.match(new RegExp(config.search.regex, "gi")) && item.game_id == config.search.game_id && item.is_live === true) {
        idstring = idstring + "user_id=" + item.id + "&";
      }
    });

    const [streams] = await Promise.all([
      axios.get(`https://api.twitch.tv/helix/streams?first=100&game_id=${config.search.game_id}&language=${config.search.language}&${idstring}`, {
        headers: { 'client-id': config.twitch.clientid, 'Authorization': 'Bearer ' + token }
      })
    ]);

    localStorage.setItem("streamers", JSON.stringify(streamers.data.data))
    localStorage.setItem("server", JSON.stringify(servers.data))
    localStorage.setItem("streams", JSON.stringify(streams.data.data));

    let date = new Date();
    date.setHours(date.getHours(),date.getMinutes()+config.time.streams_data_cache,0,0);
    localStorage.setItem("lastupdate", date);
    this.setState({
      streamers: streamers.data.data,
      server: servers.data,
      streams: streams.data.data,
      lastupdate: date
    });
  }

  async loaddata() {
    console.log("loading data from localstorage");
    await this.setState({
      streamers: JSON.parse(localStorage.getItem("streamers")),
      server: JSON.parse(localStorage.getItem("server")),
      streams: JSON.parse(localStorage.getItem("streams")),
      lastupdate: localStorage.getItem("lastupdate")
    });
  }

  async getData() {
    if (!localStorage.getItem('streamers') || !localStorage.getItem('streams') || !localStorage.getItem('server') || !localStorage.getItem('lastupdate')) {
      this.writenewdata();
    } else {
      const dateLimit = moment(localStorage.getItem("lastupdate"));
      const now = moment();
      if (dateLimit.isValid() && now.isAfter(dateLimit)) {
        console.log("data is invalid");
        localStorage.removeItem("streamers");
        localStorage.removeItem("server");
        localStorage.removeItem("streams");
        localStorage.removeItem("lastupdate");
        this.writenewdata();
      } else {
        this.loaddata();
      }
    } 
  }

  async componentDidMount() {
    this.interval = setInterval(this.getData.bind(this), (config.time.refresh_data*1000)*60);
    if (this.state.token !== "" || this.state.token == "undefined") {
      this.getData();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    function Infotext() {
      return (
        <div class="infotext">
          <p>Warum brauchen wir zugang zu deinem Account?</p>
          <p>
            Um Daten von Twitch abzufragen nutzt man eine sogenannte API. Diese ist bis zum 28.02.2022 Frei nutzbar. 
            Ab dem genannten Datum braucht man ein sogenanntes Token um die API zu nutzen, deswegen loggst du dich ein einziges mal ein.
            Beim einloggen wird das Token auf deinem Endgerät als Cookie gespeichert.
          </p>
          <p>Beim Ausloggen wird das Token auf deinem Endgerät gelöscht.</p>
          <p><a href="https://github.com/Nickwasused/luckyV-streamer-liste" rel="noreferrer" target="_blank">Der Code dieser Seite ist Open-Source. </a></p>
          <p>
            <a href="https://discuss.dev.twitch.tv/t/legacy-twitch-api-v5-shutdown-details-and-timeline/32649" rel="noreferrer" target="_blank">https://discuss.dev.twitch.tv/t/legacy-twitch-api-v5-shutdown-details-and-timeline/32649</a><br />
            <a href="https://blog.twitch.tv/en/2021/07/15/legacy-twitch-api-v5-shutdown-details-and-timeline/" rel="noreferrer" target="_blank">https://blog.twitch.tv/en/2021/07/15/legacy-twitch-api-v5-shutdown-details-and-timeline/</a>
          </p>
        </div>
      )
    }

    function Header(props) {
      const streamers = props.streamers;
      const info = props.info;
      const loggedin = props.loggedin;

      return (
        <div>
          <a name="#top"></a>
          <h1>Streamer Online: { streamers }</h1>
          <a href={info ? `https://${info.website}`:``} rel="noreferrer" target="_blank"><h2>{info ? info.name:``}</h2></a>
          <a href={`https://altstats.net/server/${config.altv.intid}`} rel="noreferrer" target="_blank"><div>Gameserver: {active ? 'Online':'Offline'}</div></a>
          <div>alt:V Version: {active ? info.version:""}</div>
          <div>Spieler Online: {info ? info.players:""}/{info ? info.maxPlayers:""}</div>
          <div>Zuletzt aktualisiert: {`${last_update} Uhr`}</div>
          <div class="shareicon">
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`} rel="noreferrer" target="_blank"><i class="fa fa-linkedin"></i></a>
            <a href={`https://twitter.com/intent/tweet?text=Schaue hier: ${window.location.href} wer auf ${config.target.website} Online ist! %23${config.target.name}`} rel="noreferrer" target="_blank"><i class="fa fa-twitter"></i></a>
            <a href={`https://reddit.com/submit?url=${window.location.href}&title=Schaue wer auf ${config.target.website} Online ist!`} rel="noreferrer" target="_blank"><i class="fa fa-reddit"></i></a>
          </div><br />
        </div>
      )
    }

    let filteredstreamers = this.state.streams.filter((stream) => {
      let {title, game_id, type, user_name} = stream;
      if (title.match(new RegExp(config.search.regex, "gi")) && game_id == config.search.game_id && type === "live") {
        return user_name.toLowerCase().includes(this.state.inputValue.toLocaleLowerCase()) || title.toLowerCase().includes(this.state.inputValue.toLocaleLowerCase())
      }
    })
    
    let {active, info} = this.state.server;
    let date = moment(this.state.lastupdate).toDate();
    date.setHours(date.getHours(),date.getMinutes()-config.time.streams_data_cache,0,0);
    
    let datestring = moment(date).format('HH:mm');
    const last_update = datestring;

    let loggedin;
    if (this.state.token == "" || this.state.token == "undefined") {
      loggedin = false;
    } else {
      loggedin = true
    }

    console.log(loggedin);

    return (
      <div>
        <div class="head">
          {loggedin ? <Header streamers={filteredstreamers.length} info={info} loggedin={loggedin} />:null}
          {loggedin ? null:<Infotext />}
          {loggedin ? <a href="/logout"><button>Ausloggen</button></a>:<a href={config.twitch.loginurl}><button>Einloggen mit Twitch</button></a>}
          {loggedin ? <input type="text" placeholder="Streamer, Streamtitel ..." value={this.state.inputValue} onChange={this.FilterOnChange}/>:null}
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
        <div class="note">{config.website.author} {(new Date().getFullYear())} | {parse(config.website.footer_text)}<br /><a href="#top">Nach oben</a></div>
      </div>
      )
    }
  } export default withCookies(React.memo(Streamers));