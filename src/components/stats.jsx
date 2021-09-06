import React from "react";
import { NavLink } from "react-router-dom";
import { config } from "../config";
import button from "../css/button.module.css";

class Stats extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    if_positive(a) {
        // Check the number is negative
        if (a < 0) {
            const ret = 24 - (a * -1);
            return ret
        }
        // Return the positive number
        return a;
    }

    render() {
        const launch_date = new Date(config.website.server_launch);
        const now = new Date();
        const diffTime = Math.abs(now - launch_date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffhoursmissing = Math.ceil(diffTime / (1000 * 60 * 60));

        const launch_days = diffDays;
        const launch_hours_missing = this.if_positive(diffhoursmissing - ((diffDays) * 24));

        return (
            <div class="head">
                <NavLink exact to="/" activeClassName="selected">
                    <button className={button.button}>Zurück</button>
                </NavLink>
                <table>
                    <tr>
                        <td>
                            <h1>Server Released seit: {launch_days} Tagen und {launch_hours_missing} Stunden</h1>
                        </td>
                    </tr>
                </table>
            </div>
        );
    }
}
export default React.memo(Stats);
