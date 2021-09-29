import React from "react";
import button from "../css/button.module.css";
import NumericInput from 'react-numeric-input';
import { config } from "../config";
import { NavLink } from "react-router-dom";
import { togglesetting, setnumbersetting, getboolean, getsettingordefault } from "../js/settings.js";

class Settings extends React.PureComponent {
    refreshcomponent() {
        this.setState({ time: Date.now() });
    }

    toggle(setting) {
        togglesetting(setting);
        this.refreshcomponent();
    }

    handleminviewers(num) {
        setnumbersetting("minviewers", num);
        return num
    }

    handlemaxviewers(num) {
        setnumbersetting("maxviewers", num);
        return num
    }

    handleimageproxyurl = (event) => {
        console.log(event.target.value)
    };
    
    render() {
        return (
            <div>
                <NavLink exact to="/" activeClassName="selected">
                    <center>
                        <button className={button.button}>Zurück</button>
                    </center>
                </NavLink>
                <br />
                <NavLink exact to="/logout" activeClassName="selected">
                    <center>
                        <button className={button.button}>Ausloggen</button>
                    </center>
                </NavLink>
                <table>
                    <tr>
                        <td>Buttons zum teilen anzeigen (Share-Icons)</td>
                        <td>
                            {!!getboolean(getsettingordefault("shareicons", config.settings.shareicons))
                                ? "eingeschaltet"
                                : "ausgeschaltet"}
                        </td>
                        <td>
                            <label className={button.switch}>
                                <input type="checkbox" checked={getboolean(getsettingordefault("shareicons", config.settings.shareicons))} />
                                <span onClick={() => this.toggle("shareicons")} className={button.slider}></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td>Minimale Zuschauer Anzahl</td>
                        <td>
                            {getsettingordefault("minviewers", config.settings.minviewers)}
                        </td>
                        <td>
                            <NumericInput precision={0} value={getsettingordefault("minviewers", config.settings.minviewers)} step={1} format={this.handleminviewers}/>
                        </td>
                    </tr>
                    <tr>
                        <td>Maximale Zuschauer Anzahl</td>
                        <td>
                            {getsettingordefault("maxviewers", config.settings.maxviewers)}
                        </td>
                        <td>
                            <NumericInput precision={0} value={getsettingordefault("maxviewers", config.settings.maxviewers)} step={1} format={this.handlemaxviewers}/>
                        </td>
                    </tr>
                    <tr>
                        <td>Benutze ein Bild Proxy</td>
                        <td>
                            {!!getboolean(getsettingordefault("imageproxy", config.settings.imageproxy))
                                ? "eingeschaltet"
                                : "ausgeschaltet"}
                        </td>
                        <td>
                            <label className={button.switch}>
                                <input type="checkbox" checked={getboolean(getsettingordefault("imageproxy", config.settings.imageproxy))} />
                                <span onClick={() => this.toggle("imageproxy")} className={button.slider}></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td>Bild Proxy Url</td>
                        <td>
                            {getsettingordefault("imageproxyurl", config.settings.imageproxyurl)}
                        </td>
                        <td>
                            <input
                                type="text"
                                value={getsettingordefault("imageproxyurl", config.settings.imageproxyurl)}
                                onChange={this.handleimageproxyurl}
                            />
                        </td>
                    </tr>
                </table>
            </div>
        );
    }
}
export default React.memo(Settings);
