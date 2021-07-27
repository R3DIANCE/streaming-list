import React from 'react';

class Login extends React.PureComponent {
  componentDidMount() {
    if (localStorage.getItem("token") == null && !((localStorage.getItem("token") + '').match(/[a-z0-9]{30}/gm))) {
      console.log("test");
      const token = this.props.location.hash.replace("#access_token=", "").replace("&scope=", "").replace("&token_type=bearer", "");
      console.log(token);
      localStorage.setItem("token", token);
    }
  }

  render() {
    return (
      <div>
          <meta http-equiv="refresh" content="1; url=."></meta>
      </div>
    )
  }
} export default React.memo(Login);