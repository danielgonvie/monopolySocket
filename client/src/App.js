import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Login from "./components/Login/Login";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import MonopolyGame from "./components/MonopolyGame/MonopolyGame";

export default class App extends Component {
  constructor(props) {
    super(props);

  }

  state = {
    username: null,
  };

  setUser = username => {
    console.log(username)
    this.setState({ ...this.state, username });
  };

  componentDidMount() {

  }

  render() {
    const { username } = this.state;

    const NoMatch = ({ location }) => {
      console.log(location)
      return(
      <div className="nomatch-component">
        <img
          className="no-gif"
          src="https://media2.giphy.com/media/ly8G39g1ujpNm/giphy.gif?cid=790b761142e4c6ee9a3e38ce715d90695af72b14bdcd671f&rid=giphy.gif"
          alt="404"
        ></img>
        No se encontró <b>{location.pathname}</b> 
      </div>
    )};

    return (
      <div>
        {username && (
          <Routes>
            <Route
              exact
              path="/"
              element={<Link to="/monopoly">MONOPOLY</Link>}
            />
            <Route
              exact
              path="/monopoly"
              element={<MonopolyGame username={username} />}
            />

            <Route element={<NoMatch/>} />
          </Routes>
        )}

        {!username && (
          <Routes>
            <Route
              exact
              path="/"
              element={<Login setUser={this.setUser} username={username}/>}
            />
            <Route
              exact
              path="/monopoly"
              element={<Login setUser={this.setUser} username={username}/>}
            />

            <Route element={<NoMatch/>} />
          </Routes>
        )}
      </div>
    );
  }
}
