import React, { Component } from 'react';
import axios from 'axios';
import {NavLink} from 'react-router-dom';
import Bound from 'bounds.js';
import moment from 'moment';

class Streamerdetails extends React.PureComponent {
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
      channel: [],
      base64string: "",
      vods: []
    }

    async componentDidUpdate() {
        const images = document.querySelectorAll('img')
        images.forEach(image => {
          this.boundary.watch(image, this.whenImageEnters(image))
        })
        document.title = Buffer.from(this.state.base64string, 'base64').toString('ascii');
    }

    async writenewdata() {
      console.log("writing new data");
      const { twitchname } = this.props.match.params;
      const getid = 
          await axios.get(`https://api.twitch.tv/kraken/users?login=` + Buffer.from(twitchname, 'base64').toString('ascii'), {
            headers: { 'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': Buffer.from("ZmszanN6MGxzaGltOThheHo2Y2Iyc3ZwcHRsdXpl", 'base64').toString('ascii') }
          });
          
        const channelid = getid.data.users[0]._id;
        localStorage.setItem('streamer:id:'+twitchname, channelid);

        const [channel, vods] = await Promise.all([
            axios.get(`https://api.twitch.tv/kraken/channels/` + channelid, {
                headers: { 'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': Buffer.from("ZmszanN6MGxzaGltOThheHo2Y2Iyc3ZwcHRsdXpl", 'base64').toString('ascii') }
            }),
            axios.get(`https://api.twitch.tv/kraken/channels/`+ channelid +`/videos?limit=100`, {
                headers: { 'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': Buffer.from("ZmszanN6MGxzaGltOThheHo2Y2Iyc3ZwcHRsdXpl", 'base64').toString('ascii') }
            })
        ]);

      localStorage.setItem('streamer:channel:'+twitchname, JSON.stringify(channel.data))
      localStorage.setItem('streamer:vods:'+twitchname, JSON.stringify(vods.data.videos))

      this.setState({
        channel: channel.data,
        base64string: twitchname,
        vods: vods.data.videos
      });

      var d = new Date();
      d.setHours(d.getHours(),d.getMinutes()+60,0,0);
      localStorage.setItem('invaliddata:streamer:'+twitchname, d);
    }

    async loaddata() {
      const { twitchname } = this.props.match.params;
      console.log("loading data from localstorage");
      this.setState({
        channel: JSON.parse(localStorage.getItem('streamer:channel:'+twitchname)),
        base64string: twitchname,
        vods: JSON.parse(localStorage.getItem('streamer:vods:'+twitchname))
      });
    }

    async getData() {
      const { twitchname } = this.props.match.params;
      if (!localStorage.getItem('invaliddata:streamer:'+twitchname) && !localStorage.getItem('streamer:id:'+twitchname) && !localStorage.getItem('streamer:channel:'+twitchname) && !localStorage.getItem('streamer:vods:'+twitchname)) {
        this.writenewdata();
      } else {
        const dateLimit = moment(localStorage.getItem("invaliddata:streamer:"+twitchname));
        const now = moment();
        if (dateLimit.isValid() && now.isAfter(dateLimit)) {
          console.log("data is invalid");
          localStorage.removeItem("streamer:id:"+twitchname);
          localStorage.removeItem("streamer:channel:"+twitchname);
          localStorage.removeItem("streamer:vods:"+twitchname);
          localStorage.removeItem("invaliddata:streamer:"+twitchname);
          this.writenewdata();
        } else {
          this.loaddata();
        }
      }
    }

    async componentDidMount() {
      this.getData();
    }

    render() {
      const {mature, status, broadcaster_language, broadcaster_software, display_name, game, language, _id, name, created_at, updated_at, partner, logo, video_banner, profile_banner, profile_banner_background_color, url, views, followers, broadcaster_type, description, private_video, privacy_options_enabled} = this.state.channel;
      
      return (
        <div class="streamerdetails">
          <meta name="twitter:card" content="photo" />
          <meta name="twitter:title" content={display_name} />
          <meta name="twitter:description" content={"Schaue dir " + display_name + " auf Twitch an!"} />
          <meta name="twitter:image" content={logo} />
          <meta name="twitter:url" content={"https://luckyv.nickwasused.eu/streamer/" + this.state.base64string} />
            <NavLink 
                exact to="/" 
                activeClassName="selected">
                <button>Zurück</button>
            </NavLink><br/>
            <a href={url} rel="noreferrer" target="_blank"><h1>{display_name}</h1></a>
            <div class="shareicon">
            <a href={"https://www.linkedin.com/shareArticle?mini=true&url=https://luckyv.nickwasused.eu/streamer/" + this.state.base64string} rel="noreferrer" target="_blank"><img data-src="/img/social/LI-Logo.png" alt="Likedin Share Button"></img></a>
            <a href={"https://twitter.com/intent/tweet?text=Schaue dir jetzt " + display_name + " live auf %23LuckyV an. https://luckyv.nickwasused.eu/streamer/" + this.state.base64string} rel="noreferrer" target="_blank"><img data-src="/img/social/Logo blue.svg" alt="Twitter Share Button"></img></a>
            <a href={"https://reddit.com/submit?url=https://luckyv.nickwasused.eu&title=Schaue dir jetzt " + display_name + " live auf https://luckyv.de an. https://luckyv.nickwasused.eu/streamer/" + this.state.base64string} rel="noreferrer" target="_blank"><img data-src="/img/social/Reddit_Mark_OnDark.svg" alt="Reddit Share Button"></img></a>
          </div><br />
            <table>
                <tr>
                    <td>Streamtitel</td><td>{status}</td>
                </tr>
                <tr>
                    <td>Sprache</td><td>{broadcaster_language}</td>
                </tr>
                <tr>
                    <td>Kategorie / Spiel</td><td>{game}</td>
                </tr>
                <tr>
                    <td>Follower</td><td>{followers}</td>
                </tr>
                <tr>
                    <td>Views</td><td>{views}</td>
                </tr>
                <tr>
                    <td>Beschreibung</td><td>{description}</td>
                </tr>
                <tr>
                    <td>Streamer-Typ</td><td>{broadcaster_type}</td>
                </tr>
            </table>
            <ul class="cards">
            {
            this.state.vods.map((vod) => {
              const {_id, url, status, title, game, preview, views, channel} = vod;
              if (status === "archive" | status === "recorded") {
                return (
                  <li class="cards__item" key={_id}>
                    <a href={url} rel="noreferrer" target="_blank">
                    <div class="card">
                    <div class="card__image"><img width="640px" height="340px" data-src={preview.large} alt={channel.display_name} referrerPolicy="same-origin"></img></div>
                      <div class="card__content">
                        <div class="card__title">{channel.display_name}</div>
                        <p class="card__text">
                          {channel.status}<br />
                          Views: {views}<br />
                          Kategorie / Spiel: {game}<br />
                        </p>
                        </div>
                      </div>
                    </a>
                  </li>
                )
              }
            })
          }
          </ul>
        </div>
      )
    }
  } export default React.memo(Streamerdetails);