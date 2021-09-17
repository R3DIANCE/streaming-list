import React from "react";
import { NavLink } from "react-router-dom";
import { config } from "../config";
import button from "../css/button.module.css";

class Stats extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            dates: []
        }
    }

    to_universal_time(time) {
        return new Date(time);
    }

    timesince(start) {
        const launch_date = this.to_universal_time(new Date(start));
        const now = this.to_universal_time(new Date());
        const diffTime = Math.abs(now - launch_date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffhoursmissing = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffminutesmissing = Math.ceil(diffTime / (1000 * 60));

        let launch_days = diffDays;
        let launch_hours_missing = diffhoursmissing - ((diffDays) * 24);
        let launch_minutes_missing = 60 - ((diffminutesmissing - (diffhoursmissing * 60)) * -1);

        if (launch_hours_missing <= 0) {
            launch_days = launch_days -1
            if (launch_hours_missing === 24) {
                launch_hours_missing = 0;
            } else if (launch_hours_missing <= 0) {
                launch_hours_missing = launch_hours_missing * -1;
                launch_hours_missing = 24 - launch_hours_missing;
                launch_hours_missing = Math.floor(((launch_hours_missing * 60) - ((diffminutesmissing - (diffhoursmissing * 60)) * -1)) / 60);
            }
        }

        
        let daytext;
        let hourtext;
        let minutestext;

        /*
        if (launch_days >= 1 || launch_days === 0) {
            daytext = `${launch_days} Tagen`;
        } else {
            daytext = `einem Tag`
        }
        */
        daytext = `Tagen`

        if (launch_hours_missing > 1 || launch_hours_missing === 0) {
            hourtext = `${launch_hours_missing} Stunden`
        } else (
            hourtext = `einer Stunde`
        )

        if (launch_minutes_missing >= 1 || launch_minutes_missing === 0) {
            minutestext = `${launch_minutes_missing} Minuten`
        } else (
            minutestext = `einer Minute`
        )
        return { daytext, hourtext, minutestext }
    }

    Time(text, time) {
        let { daytext, hourtext, minutestext } = this.timesince(time);
        return ({ text, daytext, hourtext, minutestext });
    }

    getdates() {
        let tempdates = [];
        config.dates.forEach((historicevent) => {
            tempdates.push(this.Time(historicevent.description.toString(), historicevent.date.toString()));
        });
        this.setState({
            dates: tempdates
        });
    }

    async componentDidMount() {
        this.interval = setInterval(
            this.getdates.bind(this),
            config.time.refresh_dates * 1000 * 60
        );
        this.getdates();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div class="head">
                <NavLink exact to="/" activeClassName="selected">
                    <button className={button.button}>Zurück</button>
                </NavLink>
                <table>
                    {
                        this.state.dates.map((historiceventobject) => {
                            return (
                            <tr>
                                <td><p>{historiceventobject.text}:</p></td>
                                <td><p>{historiceventobject.daytext}, {historiceventobject.hourtext} und {historiceventobject.minutestext}</p></td>
                            </tr>
                            )
                        })
                    }
                </table>
            </div>
        );
    }
}
export default React.memo(Stats);
