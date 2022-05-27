import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./components/Login/Login";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MonopolyGame from "./components/MonopolyGame/MonopolyGame";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    username: null,
  };

  setUser = username => {
    this.setState({ ...this.state, username });
  };

  componentDidMount() {

  }

  render() {
    const { username } = this.state;

    const NoMatch = ({ location }) => (
      <div className="nomatch-component">
        <img
          className="no-gif"
          src="https://media2.giphy.com/media/ly8G39g1ujpNm/giphy.gif?cid=790b761142e4c6ee9a3e38ce715d90695af72b14bdcd671f&rid=giphy.gif"
          alt="404"
        ></img>
         
      </div>
    );

    return (
      <div>
        {username && (
          <Switch>
            <Route
              exact
              path="/"
              render={match => (
                <React.Fragment>
                  <MonopolyGame {...match} username={username}></MonopolyGame>
                </React.Fragment>
              )}
            />
            <Route component={NoMatch} />
          </Switch>
        )}

        {!username && (
          <Switch>
            <Route
              exact
              path="/"
              render={match => (
                <React.Fragment>
                  <Login {...match} setUser={this.setUser}/>
                </React.Fragment>
              )}
            />
            <Route component={NoMatch} />
          </Switch>
        )}
      </div>
    );
  }
}
