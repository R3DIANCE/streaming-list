import React from 'react';
import axios from 'axios';
import {NavLink} from 'react-router-dom';
import Bound from 'bounds.js';
import moment from 'moment';

class Streamerdetails extends React.PureComponent {
    constructor() {
		super();

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
      channel: [],
      vods: []
    }

    async componentDidUpdate() {
        const images = document.querySelectorAll('img')
        images.forEach(image => {
          this.boundary.watch(image, this.whenImageEnters(image))
        })
    }

    async writenewdata() {
      console.log("writing new data");
      const { twitchname, id } = this.props.match.params;
      const token = localStorage.getItem("token");

      const [channel, vods] = await Promise.all([
        axios.get(`https://api.twitch.tv/helix/channels?broadcaster_id=${id}`, {
          headers: { 'Client-ID': Buffer.from(this.clientidbase64, 'base64').toString('ascii'), 'Authorization': 'Bearer ' + token }
        }),
        axios.get(`https://api.twitch.tv/helix/videos?user_id=${id}`, {
          headers: { 'Client-ID': Buffer.from(this.clientidbase64, 'base64').toString('ascii'), 'Authorization': 'Bearer ' + token }
        })
      ]);

      localStorage.setItem('streamer:vods:'+twitchname, JSON.stringify(vods.data.data))
      localStorage.setItem('streamer:channel:'+twitchname, JSON.stringify(channel.data.data[0]))

      this.setState({
        channel: JSON.parse(localStorage.getItem('streamer:channel:'+twitchname)),
        vods: JSON.parse(localStorage.getItem('streamer:vods:'+twitchname))
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
        vods: JSON.parse(localStorage.getItem('streamer:vods:'+twitchname))
      });
    }

    async getData() {
      const { twitchname } = this.props.match.params;
      if (!localStorage.getItem('invaliddata:streamer:'+twitchname) | !localStorage.getItem('streamer:id:'+twitchname) | !localStorage.getItem('streamer:channel:'+twitchname) | !localStorage.getItem('streamer:vods:'+twitchname)) {
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
      const { twitchname } = this.props.match.params;
      let {broadcaster_id, broadcaster_language, game_name, title} = this.state.channel;

      return (
        <div class="streamerdetails">
          <a name="#top"></a>
          <meta name="twitter:card" content="photo" />
          <meta name="twitter:title" content={twitchname} />
          <meta name="twitter:description" content={`Schaue dir ${twitchname} auf Twitch an!`} />
          <meta name="twitter:url" content={`https://luckyv.nickwasused.eu/streamer/${twitchname}`} />
            <NavLink 
                exact to="/" 
                activeClassName="selected">
                <button>Zurück</button>
            </NavLink><br/>
            <div class="streamergrid">
            <div class="A"><a href={`https://twitch.tv/${twitchname}`} rel="noreferrer" target="_blank"><table class="profileheader"><tr><td><h1>{twitchname}</h1></td><td></td></tr></table></a></div>
              <div class="B">
                  <div class="shareicon">
                    <a href={`https://www.linkedin.com/shareArticle?mini=true&url=https://luckyv.nickwasused.eu/streamer/${twitchname}`} rel="noreferrer" target="_blank"><i class="fa fa-linkedin"></i></a>
                    <a href={`https://twitter.com/intent/tweet?text=Schaue dir jetzt ${twitchname} live auf %23LuckyV an. https://luckyv.nickwasused.eu/streamer/${twitchname}`} rel="noreferrer" target="_blank"><i class="fa fa-twitter"></i></a>
                    <a href={`https://reddit.com/submit?url=https://luckyv.nickwasused.eu&title=Schaue dir jetzt ${twitchname} live auf https://luckyv.de an. https://luckyv.nickwasused.eu/streamer/${twitchname}`} rel="noreferrer" target="_blank"><i class="fa fa-reddit"></i></a>
                  </div><br />
                  <table>
                    <tr>
                      <td>Streamtitel</td><td>{title}</td>
                    </tr>
                    <tr>
                      <td>Sprache</td><td>{broadcaster_language}</td>
                    </tr>
                    <tr>
                        <td>Kategorie / Spiel</td><td>{game_name}</td>
                    </tr>
                  </table>
              </div>
              <div class="C">
                  <li class="cards__item" key={broadcaster_id}>
                  <a href={`https://twitch.tv/${twitchname}`} rel="noreferrer" target="_blank">
                  <div class="bigcard">
                    <div class="card__image">
                      <img width="640px" height="340px" src="/img/placeholder.webp" data-src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitchname}-640x360.jpg?${new Date()}`} referrerPolicy="same-origin"></img>
                      <div class="text-block"><i class="fa fa-circle"></i>Live</div>
                    </div>
                    <div class="card__content">
                      <p class="card__text">
                        {title}
                      </p>
                    </div>
                  </div>
                    </a>
                  </li>
                </div>
            </div>
            <ul class="cards">
            {
            this.state.vods.map((vod) => {
              const {id, url, title, type, duration, thumbnail_url, view_count, display_name} = vod;
              if (type === "archive" | type === "recorded") {
                return (
                  <li class="cards__item" key={id}>
                    <a href={url} rel="noreferrer" target="_blank">
                    <div class="card">
                    <div class="card__image"><img width="640px" height="340px" src="/img/placeholder.webp" data-src={thumbnail_url ? thumbnail_url.replace("%{width}", "640").replace("%{height}", "340"):"/img/placeholder.webp"} alt={display_name} referrerPolicy="same-origin"></img><div class="text-block">Aufrufe: {view_count}<br />Länge: {duration}</div></div>
                      <div class="card__content">
                        <p class="card__text">
                          {title}<br />
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
          <div class="note">Nickwasused {(new Date().getFullYear())} | We &#128155; LuckyV<br /><a href="#top">Nach oben</a></div>
        </div>
      )
    }
  } export default React.memo(Streamerdetails);