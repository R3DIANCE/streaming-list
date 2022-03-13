import React from "react";
import Bound from "bounds.js";
import { isafternow } from "../js/time.js";
import parse from "html-react-parser";
import button from "../css/button.module.css";
import streamer from "../css/streamer.module.css";
import moment from 'moment'
import { get } from "axios";
import { getboolean, getsettingordefault } from "../js/settings.js";
import { NavLink } from "react-router-dom";
import { config } from "../config";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

class Streamers extends React.PureComponent {
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
        streamers: [],
        streams: [],
        server: [],
        token: this.props.cookies.get("token") || "",
        inputValue: "",
        lastupdate: "",
        viewers: 0
    };

    FilterOnChange = (event) => {
        this.setState({
            inputValue: event.target.value,
        });
    };

    async componentDidUpdate() {
        const images = document.querySelectorAll("img");
        images.forEach((image) => {
            this.boundary.watch(image, this.whenImageEnters(image));
        });
        document.title = config.website.title;
    }

    async getstreamers() {
        let streamers = [];

        await Promise.all([
            get(
                `https://twitch-search-server.fly.dev/search?title=${encodeURIComponent(config.search.term)}`
            ).then(response => {
                response.data.map((streamer) => {
                    return streamers.push(streamer);
                })
            })
        ]);
        return streamers;
    }

    idhandler(ids) {
        let idcount = 0;
        let idcountreal = 0;
        let idstrings = [];
        let tempidstring = "";

        for (const value of ids) {
            if (idcount >= 99) {
                tempidstring = tempidstring + "user_id=" + value;
                idstrings.push(tempidstring);
                tempidstring = "";
                idcount = 0;
            } else if (idcountreal + 1 >= ids.length) {
                tempidstring = tempidstring + "user_id=" + value;
                idstrings.push(tempidstring);
            } else {
                tempidstring = tempidstring + "user_id=" + value + "&";
                idcount++;
            }
            idcountreal++;
        }
        return idstrings;
    }

    async getstreams(idstrings) {
        const token = this.state.token;
        let streams = [];

        // every idstring has 99 ids. This loop runs 99 times. 99 * 99 ids = 9.801 Streams with 99 requests to the Twitch API
        for (let i = 0; i < 100; i++) {
            if (idstrings[i] === undefined) {
                break;
            }
            let requeststring = `https://api.twitch.tv/helix/streams?first=100&game_id=${encodeURIComponent(config.search.game_id)}&language=${encodeURIComponent(config.search.language)}&${idstrings[i]}`;
            await Promise.all([
                get(
                    requeststring,
                    {
                        headers: {
                            "client-id": config.twitch.clientid,
                            Authorization: "Bearer " + token,
                        },
                    }
                ).then(response => {
                    response.data.data.map((stream) => {
                        return streams.push(stream);
                    })
                })
            ]);
        }
        return streams;
    }

    async writenewdata() {
        console.log("writing new data");

        const [servers] = await Promise.all([
            get(`https://altv-cache.nickwasused.com/api/getserverbyid?serverid=${encodeURIComponent(config.altv.longid)}`, {
                headers: { accept: "application/json" },
            })
        ]);

        let streamers = await this.getstreamers();
        let ids = [];
        streamers.map((item) => {
            if (
                item.title.match(new RegExp(config.search.regex, "gi")) &&
                item.game_id === config.search.game_id &&
                item.type === "live"
            ) {
                return ids.push(item.user_id);
            } else {
                return null;
            }
        });

        let idstrings = this.idhandler(ids);
        let streams = await this.getstreams(idstrings);
        
        localStorage.setItem("streamers", JSON.stringify(streamers));
        localStorage.setItem("server", JSON.stringify(servers.data));
        localStorage.setItem("streams", JSON.stringify(streams));

        let date = new Date();
        date.setHours(
            date.getHours(),
            date.getMinutes() + config.time.streams_data_cache,
            0,
            0
        );
        localStorage.setItem("lastupdate", date);
        this.setState({
            streamers: streamers,
            server: servers.data,
            streams: streams,
            lastupdate: date
        });
    }

    async loaddata() {
        console.log("loading data from localstorage");
        await this.setState({
            streamers: JSON.parse(localStorage.getItem("streamers")),
            server: JSON.parse(localStorage.getItem("server")),
            streams: JSON.parse(localStorage.getItem("streams")),
            lastupdate: localStorage.getItem("lastupdate"),
        });
    }

    async getData() {
        if (
            !localStorage.getItem("streamers") ||
            !localStorage.getItem("streams") ||
            !localStorage.getItem("server") ||
            !localStorage.getItem("lastupdate")
        ) {
            this.writenewdata();
        } else {
            const dateLimit = localStorage.getItem("lastupdate");
            if (dateLimit !== null && isafternow(dateLimit)) {
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
        this.interval = setInterval(
            this.getData.bind(this),
            config.time.refresh_data * 1000 * 60
        );
        if (this.state.token !== "" || this.state.token === "undefined") {
            this.getData();
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        function Infotext() {
            return (
                <div className={streamer.infotext}>
                    <p>Warum brauchen wir zugang zu deinem Account?</p>
                    <p>
                        Um Daten von Twitch abzufragen nutzt man eine sogenannte
                        API. Diese ist bis zum 28.02.2022 Frei nutzbar. Ab dem
                        genannten Datum braucht man ein sogenanntes Token um die
                        API zu nutzen, deswegen loggst du dich ein einziges mal
                        ein. Beim einloggen wird das Token auf deinem Endgerät
                        als Cookie gespeichert.
                    </p>
                    <p>
                        Beim Ausloggen wird das Token auf deinem Endgerät
                        gelöscht.
                    </p>
                    <p>
                        <a
                            href="https://github.com/Nickwasused/luckyV-streamer-liste"
                            rel="noreferrer"
                            target="_blank"
                        >
                            Der Code dieser Seite ist Open-Source.{" "}
                        </a>
                    </p>
                    <p>
                        <a
                            href="https://discuss.dev.twitch.tv/t/legacy-twitch-api-v5-shutdown-details-and-timeline/32649"
                            rel="noreferrer"
                            target="_blank"
                        >
                            https://discuss.dev.twitch.tv/t/legacy-twitch-api-v5-shutdown-details-and-timeline/32649
                        </a>
                        <br />
                        <a
                            href="https://blog.twitch.tv/en/2021/07/15/legacy-twitch-api-v5-shutdown-details-and-timeline/"
                            rel="noreferrer"
                            target="_blank"
                        >
                            https://blog.twitch.tv/en/2021/07/15/legacy-twitch-api-v5-shutdown-details-and-timeline/
                        </a>
                    </p>
                </div>
            );
        }

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
                        href={`https://twitter.com/intent/tweet?text=Schaue hier: ${window.location.href} wer auf ${config.target.website} Online ist! %23${config.target.name}`}
                        rel="noreferrer"
                        target="_blank"
                    >
                        <i class="fa fa-twitter"></i>
                    </a>
                    <a
                        href={`https://reddit.com/submit?url=${window.location.href}&title=Schaue wer auf ${config.target.website} Online ist!`}
                        rel="noreferrer"
                        target="_blank"
                    >
                        <i class="fa fa-reddit"></i>
                    </a>
                </div>
            );
        }

        function Header(props) {
            const streamers = props.streamers;
            const info = props.info;
            const shareicons = props.shareicons;
            const viewers = props.viewers;

            return (
                <div>
                    <a class="anchor" href="/#" name="#top">
                        Top
                    </a>
                    <NavLink exact to="/settings" activeClassName="selected">
                        <div class="settingsicon">
                            <i class="fa fa-cog"></i>
                        </div>
                    </NavLink>
                    <table className={streamer.maintable}>
                        <tr>
                            <td>
                                <h1>Streamer Online: {streamers}</h1>
                                <NavLink exact to="/stats" activeClassName="selected">
                                    <h2>Statistiken und Daten</h2>
                                </NavLink>
                            </td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <td>
                                <a
                                    href={`https://altv.mp`}
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    alt:V Version:
                                </a>
                            </td>
                            <td>{active ? info.version : ""}</td>
                        </tr>
                        <tr>
                            <td>
                                <a
                                    href={`https://altstats.net/server/${config.altv.intid}`}
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    Gameserver:
                                </a>
                            </td>
                            <td>{active ? "Online" : "Offline"}</td>
                        </tr>
                        <tr>
                            <td>Spieler Online:</td>
                            <td>
                                {info ? info.players : ""}/
                                {info ? info.maxPlayers : ""}
                            </td>
                        </tr>
                        <tr>
                            <td>Zuschauer insgesamt:</td>
                            <td>
                                {viewers}
                            </td>
                        </tr>
                        <tr>
                            <td>Zuletzt aktualisiert:</td>
                            <td>{`${last_update} Uhr`}</td>
                        </tr>
                    </table>
                    <div> </div>
                    {shareicons ? <Shareicons /> : null}
                </div>
            );
        }

        let viewers = 0;
        this.state.streams.map((stream) => {
            let { title, game_id, type, viewer_count } = stream;
            if (
                title.match(new RegExp(config.search.regex, "gi")) &&
                game_id === config.search.game_id &&
                type === "live"
            ) {
                return (
                    viewers = viewers + viewer_count
                );
            } else {
                return null;
            }
        })

        this.setState({
            viewers: viewers
        });

        let filteredstreamers = this.state.streams.filter((stream) => {
            let { title, game_id, type, user_name, viewer_count } = stream;
            if (
                title.match(new RegExp(config.search.regex, "gi")) &&
                game_id === config.search.game_id &&
                type === "live" &&
                viewer_count <= getsettingordefault("maxviewers", "50000") &&
                viewer_count >= getsettingordefault("minviewers", "0")
            ) {
                return (
                    user_name
                        .toLowerCase()
                        .includes(this.state.inputValue.toLocaleLowerCase()) ||
                    title
                        .toLowerCase()
                        .includes(this.state.inputValue.toLocaleLowerCase()) ||
                    viewer_count.toString()
                        .includes(this.state.inputValue.toLocaleLowerCase())
                );
            } else {
                return null;
            }
        });

        let { active, info } = this.state.server;
        let date = new Date(this.state.lastupdate);
        date.setHours(
            date.getHours(),
            date.getMinutes() - config.time.streams_data_cache,
            0,
            0
        );

        let datestring = `${date.getHours()}:${date.getMinutes()}`;
        const last_update = datestring;

        let loggedin;
        if (this.state.token === "" || this.state.token === "undefined") {
            loggedin = false;
        } else {
            loggedin = true;
        }

        let now = new Date();

        return (
            <div>
                <div class="head">
                    {loggedin ? (
                        <Header
                            streamers={filteredstreamers.length}
                            info={info}
                            loggedin={loggedin}
                            shareicons={getboolean(getsettingordefault("shareicons", "true"))}
                            viewers={this.state.viewers}
                        />
                    ) : null}
                    {loggedin ? null : <Infotext />}
                    {loggedin ? null : (
                        <a href={config.twitch.loginurl}>
                            <button className={button.button}>
                                Einloggen mit Twitch
                            </button>
                        </a>
                    )}
                    <br />
                    {loggedin ? (
                        <div className={streamer.searchcombo}>
                            <input
                                type="text"
                                placeholder="Streamer, Streamtitel, Zuschaueranzahl ..."
                                value={this.state.inputValue}
                                onChange={this.FilterOnChange}
                            />
                            <span classname={streamer.searchcombobutton}><i class="fa fa-search"></i></span>
                        </div>
                    ) : null}<br />
                </div>
                <ul className={streamer.cards}>
                    {filteredstreamers.map((stream) => {
                        const {
                            id,
                            user_id,
                            user_name,
                            user_login,
                            title,
                            thumbnail_url,
                            viewer_count,
                            started_at,
                        } = stream;


                        // Stream runtime calculation
                        const startDate = moment(started_at);
                        const timeEnd = moment();
                        const diff = timeEnd.diff(startDate);
                        const diffDuration = moment.duration(diff);

                        let hours = (diffDuration.hours());
                        let minuets = (diffDuration.minutes());
                        let seconds = (diffDuration.seconds());

                        var tempdate = new Date();
                        tempdate.setHours(hours, minuets, seconds);

                        let preview_image = "";
                        let prepend = "";

                        if (getboolean(getsettingordefault("imageproxy", config.settings.imageproxy))) {
                            prepend = getsettingordefault("imageproxyurl", config.settings.imageproxyurl)
                        }

                        preview_image = prepend + thumbnail_url.replace("{width}", "640").replace("{height}", "360");

                        return (
                            <li className={streamer.cards__item} key={id}>
                                <NavLink
                                    exact
                                    to={
                                        "/streamer/" +
                                        user_login +
                                        "/" +
                                        user_id
                                    }
                                    activeClassName="selected"
                                >
                                    <div className={streamer.card}>
                                        <div className={streamer.card__image}>
                                            <img
                                                width="640px"
                                                height="340px"
                                                src="/img/placeholder.webp"
                                                data-src={`${preview_image}?${now.getTime()}`}
                                                alt={user_name}
                                                referrerPolicy="same-origin"
                                            ></img>
                                            <div className={streamer.textblock}>
                                                {user_name}{" "}
                                                <i class="fa fa-twitch"></i>
                                            </div>
                                        </div>
                                        <div className={streamer.card__content}>
                                            <p className={streamer.card__text}>
                                                {title}
                                                <br />
                                                Zuschauer: {viewer_count}
                                                <br />
                                                Live seit: {" "}
                                                {tempdate.toLocaleTimeString()}
                                                <br />
                                            </p>
                                        </div>
                                    </div>
                                </NavLink>
                            </li>
                        );
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
export default withCookies(React.memo(Streamers));
