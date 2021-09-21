import React from 'react';
import { get } from 'axios';
import { config } from '../config';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Logout extends React.PureComponent {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      token: this.props.cookies.get("token") || ""
    };
  }

  componentDidMount() {
    const { cookies } = this.props;
    cookies.remove("token", { path: "/" });
    get(`https://id.twitch.tv/oauth2/revoke?client_id=${encodeURIComponent(config.twitch.clientid)}&token=${encodeURIComponent(this.state.token)}`, {
        headers: { 'client-id': config.twitch.clientid, 'Authorization': 'Bearer ' + this.state.token }
    })
  }

  render() {
    return (
      <div>
          <meta http-equiv="refresh" content="1; url=."></meta>
      </div>
    )
  }
} export default withCookies(React.memo(Logout));