import React from 'react';
import axios from 'axios';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Logout extends React.PureComponent {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    this.clientidbase64 = "bWxrOHNmb2wydGYwY2Zkc2ZqazMxcGVwZDR5aDZp";

    this.state = {
      token: this.props.cookies.get("token") || ""
    };
  }

  componentDidMount() {
    const { cookies } = this.props;
    cookies.remove("token", { path: "/" });
    axios.get(`https://id.twitch.tv/oauth2/revoke?client_id=mlk8sfol2tf0cfdsfjk31pepd4yh6i&token=${this.state.token}`, {
        headers: { 'client-id': Buffer.from(this.clientidbase64, 'base64').toString('ascii'), 'Authorization': 'Bearer ' + this.state.token }
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