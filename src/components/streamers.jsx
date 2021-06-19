import React, { Component } from 'react';
import axios from 'axios';
import Bound from 'bounds.js'

class Streamers extends Component {
  constructor() {
		super();
    this.teamspeakip = "51.75.145.14";
    this.altvserverid = "bb7228a0d366fc575a5682a99359424f";
    this.searchquery = "luckyv";
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
    server: [],
    teamspeak: [],
    inputValue: ''
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
  }

  async getData() {
    console.log("loading data");
    const [streamers, servers, teamdata] = await Promise.all([
      axios.get(`https://api.twitch.tv/kraken/search/streams?query=` + this.searchquery + `&limit=100`, {
        headers: { 'accept': 'application/vnd.twitchtv.v5+json', 'client-id': Buffer.from("ZmszanN6MGxzaGltOThheHo2Y2Iyc3ZwcHRsdXpl", 'base64').toString('ascii') }
      }),
      axios.get(`https://api.altv.mp/server/` + this.altvserverid, {
        headers: { 'accept': 'application/json' }
      }),
      axios.get(`https://api.cleanvoice.ru/ts3/?address=` + this.teamspeakip, {
        headers: { 'accept': 'application/json' }
      })
    ]);

    this.state.streamers = [];
    this.state.server = [];
    this.state.teamspeak = [];

    this.setState({
      streamers: streamers.data.streams,
      server: servers.data,
      teamspeak: teamdata.data
    });
  }

  async componentDidMount() {
    this.interval = setInterval(this.getData.bind(this), 300000); // refresh data every 5 minutes (300000)
    this.getData();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let filteredstreamers = this.state.streamers.filter((streamer) => {
      const {game, stream_type, channel} = streamer
      if (channel.status.match(/luckyv/gi) && game === "Grand Theft Auto V" && stream_type === "live") { // && channel.language == "de"
        return channel.display_name.toLowerCase().includes(this.state.inputValue.toLocaleLowerCase()) || channel.status.toLowerCase().includes(this.state.inputValue.toLocaleLowerCase())
      }
    })
    
    const {active, info} = this.state.server;
    const {can_connect} = this.state.teamspeak;

    return (
      <div>
        <div class="head">
          <h1>Streamer Online: { filteredstreamers.length }</h1>
          <a href={info ? "https://"+info.website:""} rel="noreferrer" target="_blank"><h2>{info ? info.name:""}</h2></a>
          <div>Gameserver: {active ? 'Online':'Offline'}</div>
          <div>Teamspeak: {can_connect ? 'Online':'Offline'}</div>
          <div>alt:V Version: {active ? info.version:""}</div>
          <div>Spieler Online: {info ? info.players:""}/{info ? info.maxPlayers:""}</div>
          <div class="shareicon">
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://luckyv.nickwasused.eu" rel="noreferrer" target="_blank"><img data-src="/img/social/LI-Logo.png" alt="Likedin Share Button"></img></a>
            <a href="https://twitter.com/intent/tweet?text=Schaue wer auf https://luckyv.de Online ist! https://luckyv.nickwasused.eu" rel="noreferrer" target="_blank"><img data-src="/img/social/Logo blue.svg" alt="Twitter Share Button"></img></a>
            <a href="https://reddit.com/submit?url=https://luckyv.nickwasused.eu&title=Schaue wer auf https://luckyv.de Online ist!" rel="noreferrer" target="_blank"><img data-src="/img/social/Reddit_Mark_OnDark.svg" alt="Reddit Share Button"></img></a>
          </div><br />
          <input type="text" placeholder="Streamer..." value={this.inputValue} onChange={this.FilterOnChange}/>
        </div>
        <ul class="cards">
          {
            filteredstreamers.map((streamer) => {
              const {_id, viewers, video_height, average_fps, preview, channel} = streamer
              const date = new Date().getTime();
              return (
                <li class="cards__item" key={_id}>
                  <a href={"/streamer/" + Buffer.from(channel.display_name).toString('base64')} rel="noreferrer">
                  <div class="card">
                  <a href={channel.url} rel="noreferrer" target="_blank"><div class="card__image"><img width="640px" height="340px" data-src={preview.large + "?" + date} alt={channel.display_name} referrerPolicy="same-origin"></img></div></a>
		                <div class="card__content">
			                <div class="card__title">{channel.display_name}</div>
			                <p class="card__text">
				                {channel.status}<br />
                        Zuschauer: {viewers}<br />
                        Auflösung: {video_height + "p"} | FPS: {average_fps} | Follower: {channel.followers}<br />
			                </p>
		                  </div>
	                  </div>
                  </a>
                </li>
              )
            })
          }
        </ul>
      </div>
      )
    }
  } export default Streamers;