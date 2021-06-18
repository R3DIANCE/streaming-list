import React, { Component } from 'react';
import axios from 'axios';
import Bound from 'bounds.js'

class Streamers extends Component {
  constructor() {
		super();
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
    const [streamers, servers] = await Promise.all([
      axios.get(`https://api.twitch.tv/kraken/search/streams?query=luckyv&limit=100`, {
        headers: { 'accept': 'application/vnd.twitchtv.v5+json', 'client-id': Buffer.from("ZmszanN6MGxzaGltOThheHo2Y2Iyc3ZwcHRsdXpl", 'base64').toString('ascii') }
      }),
      axios.get(`https://api.altv.mp/server/bb7228a0d366fc575a5682a99359424f`, {
        headers: { 'accept': 'application/json' }
      }),
    ]);

    this.state.streamers = [];
    this.state.server = [];

    this.setState({
      streamers: streamers.data.streams,
      server: servers.data
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

    var extrainfo;

    const {active, info} = this.state.server;
    if (info !== undefined) {
      const {players} = info;
      extrainfo = "Spieler Online: " + players;
    }

    var serverstate;
    if (active) {
      serverstate = "online";
    } else {
      serverstate = "offline";
    }

    return (
      <div>
        <div class="head">
          <h1>Streamer Online: { filteredstreamers.length }</h1>
          <div>Gameserver: {serverstate}<br/>{extrainfo}</div>
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