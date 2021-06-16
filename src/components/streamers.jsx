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

  async componentDidMount() {
    const [streamers] = await Promise.all([
      axios.get(`https://api.twitch.tv/kraken/search/streams?query=luckyv&limit=100`, {
        headers: { 'accept': 'application/vnd.twitchtv.v5+json', 'client-id': 'pwkzresl8kj2rdj6g7bvxl9ys1wly3j' }
      })
    ]);

    this.setState({
      streamers: streamers.data.streams
    });
  }

  render() {
    let filteredstreamers = this.state.streamers.filter((streamer) => {
      const {_id, game, broadcast_platform, community_id, community_ids, viewers, video_height, average_fps, delay, created_at, is_playlist, stream_type, preview, channel} = streamer
      if (channel.status.match(/luckyv/gi) && game == "Grand Theft Auto V" && stream_type == "live" && channel.language == "de") { // && channel.language == "de"
        return channel.display_name.toLowerCase().includes(this.state.inputValue.toLocaleLowerCase())
      }
    })

    return (
      <div>
        <div class="head">
          <h1>Streamer Online: { filteredstreamers.length }</h1>
          <input type="text" placeholder="Streamer..." value={this.inputValue} onChange={this.FilterOnChange}/>
        </div>
        <div class="row">
          {
            this.inputValue,
            filteredstreamers.map((streamer) => {
              const {_id, broadcast_platform, community_id, community_ids, viewers, video_height, average_fps, delay, created_at, is_playlist, stream_type, preview, channel} = streamer
              return (
                <div class="column" key={_id}>
                  <a href={"https://twitch.tv/" + channel.display_name} rel="noreferrer" target="_blank">
                    <div class="card">
                      <h3>{channel.display_name}</h3>
                      <p>{channel.status}</p>
                      <ul>
                        <li>Zuschauer: {viewers}</li>
                        <li>FPS: {average_fps}</li>
                      </ul>
                      <img data-src={preview.medium} alt={channel.display_name} referrerPolicy="same-origin"></img>
                    </div>
                  </a>
                </div>
              )
            })
          }
        </div>
      </div>
      )
    }
  } export default Streamers;