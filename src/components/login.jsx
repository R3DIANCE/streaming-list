import React from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Login extends React.PureComponent {
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
    if (this.state.token == "" || this.state.token == "undefined" && !((this.state.token + '').match(/[a-z0-9]{30}/gm))) {
      const token = this.props.location.hash.replace("#access_token=", "").replace("&scope=", "").replace("&token_type=bearer", "");
      cookies.remove("token", { path: "/" });
      // 2678400 = 31 days
      cookies.set("token", token, { path: "/", sameSite: "strict", secure: true, maxAge: 2678400});
    }
  }

  render() {
    return (
      <div>
          <meta http-equiv="refresh" content="1; url=."></meta>
      </div>
    )
  }
} export default withCookies(React.memo(Login));