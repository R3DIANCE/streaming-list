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
    console.log("loading streamers");
    const [streamers] = await Promise.all([
      axios.get(`https://api.twitch.tv/kraken/search/streams?query=luckyv&limit=100`, {
        headers: { 'accept': 'application/vnd.twitchtv.v5+json', 'client-id': 'pwkzresl8kj2rdj6g7bvxl9ys1wly3j' }
      })
    ]);

    this.state.streamers = [];

    this.setState({
      streamers: streamers.data.streams
    });
  }

  async componentDidMount() {
    this.interval = setInterval(this.getData.bind(this), 300000); // refresh data every 5 minutes
    this.getData();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let filteredstreamers = this.state.streamers.filter((streamer) => {
      const {game, stream_type, channel} = streamer
      if (channel.status.match(/luckyv/gi) && game === "Grand Theft Auto V" && stream_type === "live") { // && channel.language == "de"
        return channel.display_name.toLowerCase().includes(this.state.inputValue.toLocaleLowerCase())
      }
    })

    return (
      <div>
        <div class="head">
          <h1>Streamer Online: { filteredstreamers.length }</h1>
          <input type="text" placeholder="Streamer..." value={this.inputValue} onChange={this.FilterOnChange}/>
        </div>
        <ul class="cards">
          {
            filteredstreamers.map((streamer) => {
              const {viewers, video_height, average_fps, preview, channel} = streamer
              const date = new Date().getTime();
              return (
                <li class="cards__item">
                  <a href={channel.url} rel="noreferrer" target="_blank">
                  <div class="card">
                    <div class="card__image"><img data-src={preview.large + "?" + date} alt={channel.display_name} referrerPolicy="same-origin"></img></div>
		                <div class="card__content">
			                <div class="card__title">{channel.display_name}</div>
			                <p class="card__text">
				                {channel.status}<br />
                        Zuschauer: {viewers}<br />
                        Auflösung: { video_height + "p"} | FPS: {average_fps} | Follower: {channel.followers}<br />
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