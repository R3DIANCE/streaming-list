import React from "react";
import button from "../css/button.module.css";
import { NavLink } from "react-router-dom";
import { togglesetting, getsetting, getboolean, getsettingordefault } from "../js/settings.js";

class Settings extends React.PureComponent {
    state = {
        minviewers: 0,
        maxviewers: 100
    };

    refreshcomponent() {
        this.setState({ time: Date.now() });
    }

    toggle(setting) {
        togglesetting(setting);
        this.refreshcomponent();
    }

    handleInput = event => {
        this.setState({ name: event.target.value });  
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
                            {!!getboolean(getsettingordefault("shareicons", true))
                                ? "eingeschaltet"
                                : "ausgeschaltet"}
                        </td>
                        <td>
                            <label className={button.switch}>
                                <input type="checkbox" checked={getboolean(getsettingordefault("shareicons", true))} />
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
