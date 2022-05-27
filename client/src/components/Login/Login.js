import React, { Component } from "react";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: ''
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  };

  handleLogin = e => {
    const { setUser, history } = this.props;
    e.preventDefault();
    setUser(this.state.username);
    history.push("/");
  };

  render() {
    const { username } = this.state;

    return (
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        <form className="login-form" onSubmit={this.handleLogin}>
          <div className="login-param">
            <label>Username</label>
            <input
              className="login-field"
              type="text"
              name="username"
              value={username}
              onChange={this.handleChange}
              required
              placeholder="Username"
            />
          </div>
          <input className="submit-button" type="submit" value="Join" />
        </form>
      </div>
    );
  }
}
