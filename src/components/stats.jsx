import React from "react";
import { NavLink } from "react-router-dom";
import { config } from "../config";
import button from "../css/button.module.css";

class Stats extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        function to_universal_time(time) {
            return new Date(time.toISOString());
        }

        function timesince(start) {
            
            const launch_date = to_universal_time(new Date(start));
            const now = to_universal_time(new Date());
            const diffTime = Math.abs(now - launch_date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffhoursmissing = Math.ceil(diffTime / (1000 * 60 * 60));
            const diffminutesmissing = Math.ceil(diffTime / (1000 * 60));

            let launch_days = diffDays;
            let launch_hours_missing = diffhoursmissing - ((diffDays) * 24);
            let launch_minutes_missing = 60 - ((diffminutesmissing - (diffhoursmissing * 60)) * -1);

            if (launch_hours_missing <= 0) {
                launch_days = launch_days -1
                launch_hours_missing = 24;
                if (launch_hours_missing == 24) {
                    launch_hours_missing = 0;
                }
            }
            
            let daytext;
            let hourtext;
            let minutestext;

            if (launch_days >= 1 || launch_days == 0) {
                daytext = `${launch_days} Tagen`;
            } else {
                daytext = `einem Tag`
            }

            if (launch_hours_missing > 1 || launch_hours_missing == 0) {
                hourtext = `${launch_hours_missing} Stunden`
            } else (
                hourtext = `einer Stunde`
            )

            if (launch_minutes_missing >= 1 || launch_minutes_missing == 0) {
                minutestext = `${launch_minutes_missing} Minuten`
            } else (
                minutestext = `einer Minute`
            )
            return { daytext, hourtext, minutestext }
        }

        function Time(props) {
            const text = props.text;
            const time = props.time;
            const { daytext, hourtext, minutestext } = timesince(time);
            return (
                <tr>
                    <td><p>{text}:</p></td>
                    <td><p>{daytext}, {hourtext} und {minutestext}</p></td>
                </tr>
            );
        }
        

        return (
            <div class="head">
                <NavLink exact to="/" activeClassName="selected">
                    <button className={button.button}>Zurück</button>
                </NavLink>
                <table>
                    <Time text="Zeit seit dem ersten Stresstest" time="Sun Mar 29 2020 19:30:00" />
                    <Time text="Zeit seit dem zweiten Stresstest" time="Sun Apr 19 2020 19:00:00" />
                    <Time text="Euren Charakter könnt ihr erstellen seit" time="Fri May 8 2020 18:00:00" />
                    <Time text="Server Released seit" time={config.website.server_launch} />
                    <Time text="Zeit seit dem Venture Release" time="Sun Aug 09 2020 18:00:00" />
                    <Time text="Zeit seit dem ersten State Prison Event" time="Sat Sep 26 2020 19:00:00" />
                    <Time text="Zeit seit dem Projekt split" time="Thu Mar 12 2021 16:00:00" />
                    <Time text="Zeit seit dem LuckyV Merch Shop" time="Fri Sep 3 2021 18:00:00" />
                </table>
            </div>
        );
    }
}
export default React.memo(Stats);
