import React from 'react';
import { NavLink } from 'react-router-dom';
import { togglesetting, getsetting, getboolean } from '../js/settings.js';

class Settings extends React.PureComponent {
    refreshcomponent() {
        this.setState({ time: Date.now() });
    }

    toggle(setting) {
        togglesetting(setting)
        this.refreshcomponent()
    }

    render() {
        return (
            <div>
                <NavLink 
                    exact to="/" 
                    activeClassName="selected">
                    <center><button>Zurück</button></center>
                </NavLink><br/>
                <NavLink exact to="/logout" activeClassName="selected"><center><button>Ausloggen</button></center></NavLink>

                <table>
                    <tr>
                        <td>
                            Buttons zum teilen anzeigen
                        </td>
                        <td>
                            {getboolean(getsetting("shareicons")) ? "eingeschaltet":"ausgeschaltet"}
                        </td>
                        <td>
                            <button onClick={() => this.toggle("shareicons")}>{getboolean(getsetting("shareicons")) ? "Ausschalten":"Einschalten"}</button>
                        </td>
                    </tr>
                </table>
            </div>
        )
    }
} export default React.memo(Settings);