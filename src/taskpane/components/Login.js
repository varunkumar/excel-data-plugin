import PropTypes from "prop-types";
import * as React from "react";
import { isUserLoggedIn, refreshToken } from "./superset";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  login = async () => {
    const { username, password } = this.state;
    await refreshToken(username, password);
    if (isUserLoggedIn()) {
      this.props.onLoginSuccess();
    }
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleUserChange = (event) => {
    this.setState({ username: event.target.value });
  };

  render() {
    return (
      <section className="ms-welcome__header ms-bgColor-neutralLighter ms-u-fadeIn500" style={{ padding: "5px" }}>
        Username <input type="text" name="username" value={this.state.username} onChange={this.handleUserChange} />
        <br />
        <br />
        Password{"  "}
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handlePasswordChange}
          style={{ paddingLeft: "5px" }}
        />
        <br />
        <br />
        <button type="button" onClick={this.login} style={{ float: "right", marginRight: "80px" }}>
          Login
        </button>
        <div style={{ clear: "both" }}></div>
      </section>
    );
  }
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func,
};
