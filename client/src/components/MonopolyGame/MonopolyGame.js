import React, { Component } from "react";
import socket from '../Socket/Socket';
import "./MonopolyGame.css";

export default class MonopolyGame extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: this.props.username,
    };
  }

  componentDidMount() {
    socket.emit('connected', this.state.username);
  }


  render() {

    return (
      <div className="main-bar">
        <h1>Componente Monopoly</h1>
        <p>Hola {this.state.username}</p>
      </div>
    );
  }
}
