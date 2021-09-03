import React from "react";
import button from "../css/button.module.css";
import { NavLink } from "react-router-dom";
import { togglesetting, getsetting, getboolean } from "../js/settings.js";

class Settings extends React.PureComponent {
    refreshcomponent() {
        this.setState({ time: Date.now() });
    }

    toggle(setting) {
        togglesetting(setting);
        this.refreshcomponent();
    }

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
                            {getboolean(getsetting("shareicons"))
                                ? "eingeschaltet"
                                : "ausgeschaltet"}
                        </td>
                        <td>
                            <label className={button.switch}>
                                <input type="checkbox" checked={!!getboolean(getsetting("shareicons"))} />
                                <span onClick={() => this.toggle("shareicons")} className={button.slider}></span>
                            </label>
                        </td>
                    </tr>
                </table>
            </div>
        );
    }
}
export default React.memo(Settings);
