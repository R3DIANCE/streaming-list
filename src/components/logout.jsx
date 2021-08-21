import React from 'react';
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
  }

  render() {
    return (
      <div>
          <meta http-equiv="refresh" content="1; url=."></meta>
      </div>
    )
  }
} export default withCookies(React.memo(Logout));