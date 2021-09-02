import React from 'react';
import {NavLink} from 'react-router-dom';

class Settings extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    refreshcomponent() {
        this.setState({ time: Date.now() });
    }

    setsetting(setting, state) {
        localStorage.setItem(setting, state)
    }

    getsetting(setting) {
        if (!localStorage.getItem(setting)) {
            localStorage.setItem(setting, true)
        }
        return localStorage.getItem(setting)
    }

    getboolean(string) {
        if (string === "true") {
            return true
        } else {
            return false
        }
    }

    togglesetting(setting) {
        localStorage.setItem(setting, !this.getboolean(this.getsetting(setting)))
        console.log(localStorage.getItem(setting))
        this.refreshcomponent()
        return
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
                            {this.getboolean(this.getsetting("shareicons")) ? "eingeschaltet":"ausgeschaltet"}
                        </td>
                        <td>
                            <button onClick={() => this.togglesetting("shareicons")}>{this.getboolean(this.getsetting("shareicons")) ? "Ausschalten":"Einschalten"}</button>
                        </td>
                    </tr>
                </table>
            </div>
        )
    }
} export default React.memo(Settings);