import React, { Component } from 'react';
import axios from 'axios';
import table from '../styles/table.module.css';

class Servers extends Component {
    state = {
        streamers: [],
        inputValue: ''
    }

    FilterOnChange = (event) => {
      console.log("onchange", event.target.value)
      this.setState({
        inputValue: event.target.value
      })
    }
  
    async componentDidMount() {
        const [streamers] = await Promise.all([
          axios.get(`https://api.twitch.tv/kraken/search/streams?query=luckyv.de`, {
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
        return channel.display_name.toLowerCase().includes(this.state.inputValue.toLocaleLowerCase())
      })

      return (
        <div>
            <table className={table.table}>
                <thead>
                <tr>
                    <td>Streamer</td>
                </tr>
                <tr>
                    <input type="text" placeholder="Streamer..." value={this.inputValue} onChange={this.FilterOnChange}/>
                </tr>
                </thead>
                <tbody>
                  {this.inputValue}
                    { filteredstreamers.map((streamer) => {
                      const {_id, game, broadcast_platform, community_id, community_ids, viewers, video_height, average_fps, delay, created_at, is_playlist, stream_type, preview, channel} = streamer
                      if (game == "Grand Theft Auto V") {
                        return <tr>
                        <td className={table.td}>
                          {channel.display_name}
                        </td>
                        </tr>
                      }
                    }
                    )}
                </tbody>
            </table>
        </div>
      )
    }
  } export default Servers;