import React from "react";
import Bound from "bounds.js";
import { isafternow } from "../js/time.js";
import parse from "html-react-parser";
import button from "../css/button.module.css";
import streamer from "../css/streamer.module.css";
import { get } from "axios";
import { getsetting, getboolean, getsettingordefault } from "../js/settings.js";
import { config } from "../config";
import { NavLink } from "react-router-dom";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

class Streamerdetails extends React.PureComponent {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
    };

    constructor(props) {
        super(props);
        this.boundary = Bound();
        this.whenImageEnters = (image) => {
            return () => {
                image.src = image.dataset.src;
                this.boundary.unWatch(image);
            };
        };
    }

    state = {
        channel: [],
        vods: [],
        token: this.props.cookies.get("token") || "",
    };

    async componentDidUpdate() {
        const images = document.querySelectorAll("img");
        images.forEach((image) => {
            this.boundary.watch(image, this.whenImageEnters(image));
        });
    }

    async writenewdata() {
        console.log("writing new data");
        const { twitchname, id } = this.props.match.params;
        const token = this.state.token;

        const [channel, vods] = await Promise.all([
            get(`https://api.twitch.tv/helix/channels?broadcaster_id=${encodeURIComponent(id)}`, {
                headers: {
                    "Client-ID": config.twitch.clientid,
                    Authorization: "Bearer " + token,
                },
            }),
            get(`https://api.twitch.tv/helix/videos?user_id=${encodeURIComponent(id)}`, {
                headers: {
                    "Client-ID": config.twitch.clientid,
                    Authorization: "Bearer " + token,
                },
            }),
        ]);

        localStorage.setItem(
            "streamer:vods:" + twitchname,
            JSON.stringify(vods.data.data)
        );
        localStorage.setItem(
            "streamer:channel:" + twitchname,
            JSON.stringify(channel.data.data[0])
        );

        this.setState({
            channel: JSON.parse(
                localStorage.getItem("streamer:channel:" + twitchname)
            ),
            vods: JSON.parse(
                localStorage.getItem("streamer:vods:" + twitchname)
            ),
        });

        var d = new Date();
        d.setHours(
            d.getHours(),
            d.getMinutes() + config.time.stream_info_cache,
            0,
            0
        );
        localStorage.setItem("invaliddata:streamer:" + twitchname, d);
    }

    async loaddata() {
        const { twitchname } = this.props.match.params;
        console.log("loading data from localstorage");
        this.setState({
            channel: JSON.parse(
                localStorage.getItem("streamer:channel:" + twitchname)
            ),
            vods: JSON.parse(
                localStorage.getItem("streamer:vods:" + twitchname)
            ),
        });
    }

    async getData() {
        const { twitchname } = this.props.match.params;
        if (
            !localStorage.getItem("invaliddata:streamer:" + twitchname) |
            !localStorage.getItem("streamer:channel:" + twitchname) |
            !localStorage.getItem("streamer:vods:" + twitchname)
        ) {
            this.writenewdata();
        } else {
            const dateLimit = localStorage.getItem("invaliddata:streamer:" + twitchname);
            if (dateLimit !== null && isafternow(dateLimit)) {
                console.log("data is invalid");
                localStorage.removeItem("streamer:channel:" + twitchname);
                localStorage.removeItem("streamer:vods:" + twitchname);
                localStorage.removeItem("invaliddata:streamer:" + twitchname);
                this.writenewdata();
            } else {
                this.loaddata();
            }
        }
    }

    async componentDidMount() {
        if (this.state.token !== "" || this.state.token === "undefined") {
            this.getData();
        }
    }

    render() {
        function Shareicons() {
            return (
                <div className={streamer.shareicon}>
                    <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`}
                        rel="noreferrer"
                        target="_blank"
                    >
                        <i class="fa fa-linkedin"></i>
                    </a>
                    <a
                        href={`https://twitter.com/intent/tweet?text=Schaue dir jetzt ${twitchname} live auf %23${config.target.name} an. ${window.location.href}`}
                        rel="noreferrer"
                        target="_blank"
                    >
                        <i class="fa fa-twitter"></i>
                    </a>
                    <a
                        href={`https://reddit.com/submit?url=${window.location.href}&title=Schaue dir jetzt ${twitchname} live auf ${config.target.website} an. ${window.location.href}`}
                        rel="noreferrer"
                        target="_blank"
                    >
                        <i class="fa fa-reddit"></i>
                    </a>
                </div>
            );
        }

        const { twitchname } = this.props.match.params;
        let { broadcaster_id, broadcaster_language, game_name, title } =
            this.state.channel;
        let shareicons = getboolean(getsetting("shareicons"));

        return (
            <div className={streamer.streamerdetails}>
                <a class="anchor" href="/#" name="#top">
                    Top
                </a>
                <meta name="twitter:card" content="photo" />
                <meta name="twitter:title" content={twitchname} />
                <meta
                    name="twitter:description"
                    content={`Schaue dir ${twitchname} auf Twitch an!`}
                />
                <meta
                    name="twitter:url"
                    content={`https://${window.location.href}/streamer/${twitchname}`}
                />
                <NavLink exact to="/" activeClassName="selected">
                    <button className={button.button}>Zurück</button>
                </NavLink>
                <br />
                <div className={streamer.streamergrid}>
                    <div className={streamer.A}>
                        <a
                            href={`https://twitch.tv/${twitchname}`}
                            rel="noreferrer"
                            target="_blank"
                        >
                            <table className={streamer.profileheader}>
                                <tr>
                                    <td>
                                        <h1>{twitchname}</h1>
                                    </td>
                                </tr>
                            </table>
                        </a>
                    </div>
                    <div className={streamer.B}>
                        {shareicons ? <Shareicons /> : null}
                        <table>
                            <tr>
                                <td>Streamtitel</td>
                                <td>{title}</td>
                            </tr>
                            <tr>
                                <td>Sprache</td>
                                <td>{broadcaster_language}</td>
                            </tr>
                            <tr>
                                <td>Kategorie / Spiel</td>
                                <td>{game_name}</td>
                            </tr>
                        </table>
                    </div>
                    <div className={streamer.C}>
                        <li className={streamer.cards__item} key={broadcaster_id}>
                            <a
                                href={`https://twitch.tv/${twitchname}`}
                                rel="noreferrer"
                                target="_blank"
                            >
                                <div className={streamer.bigcard}>
                                    <div className={streamer.card__image}>
                                        <img
                                            width="640px"
                                            height="340px"
                                            src="/img/placeholder.webp"
                                            data-src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitchname}-640x360.jpg?${new Date()}`}
                                            alt={twitchname}
                                            referrerPolicy="same-origin"
                                        ></img>
                                        <div className={streamer.textblock}>
                                            <i class="fa fa-circle"></i>Live
                                        </div>
                                    </div>
                                    <div className={streamer.card__content}>
                                        <p className={streamer.card__text}>{title}</p>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </div>
                </div>
                <ul className={streamer.cards}>
                    {this.state.vods.map((vod) => {
                        const {
                            id,
                            url,
                            title,
                            type,
                            duration,
                            thumbnail_url,
                            view_count,
                            display_name,
                        } = vod;

                        let preview_image = "";
                        let prepend = "";

                        if (getboolean(getsettingordefault("imageproxy", config.settings.imageproxy))) {
                            prepend = getsettingordefault("imageproxyurl", config.settings.imageproxyurl)
                        }

                        thumbnail_url ? preview_image = prepend + thumbnail_url.replace("%{width}", "640").replace("%{height}", "360") : preview_image = "/img/placeholder.webp";

                        if ((type === "archive") | (type === "recorded")) {
                            return (
                                <li className={streamer.cards__item} key={id}>
                                    <a
                                        href={url}
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        <div className={streamer.card}>
                                            <div className={streamer.card__image}>
                                                <img
                                                    width="640px"
                                                    height="340px"
                                                    src="/img/placeholder.webp"
                                                    data-src={preview_image}
                                                    alt={display_name}
                                                    referrerPolicy="same-origin"
                                                ></img>
                                                <div className={streamer.textblock}>
                                                    Aufrufe: {view_count}
                                                    <br />
                                                    Länge: {duration}
                                                </div>
                                            </div>
                                            <div className={streamer.card__content}>
                                                <p className={streamer.card__text}>
                                                    {title}
                                                    <br />
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            );
                        } else {
                            return null;
                        }
                    })}
                </ul>
                <div className={streamer.note}>
                    {config.website.author} {new Date().getFullYear()} |{" "}
                    {parse(config.website.footer_text)} <br />{" "}
                    <NavLink exact to="/privacy" activeClassName="selected">
                        <a>Datenschutzbestimmungen</a>
                    </NavLink>
                    <br />
                    <a href="#top">Nach oben</a>
                </div>
            </div>
        );
    }
}
export default withCookies(React.memo(Streamerdetails));
