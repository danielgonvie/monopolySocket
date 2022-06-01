import React, { Component } from "react";
import "./MonopolyBoard.scss";

import socket from '../Socket/Socket';

export default class MonopolyBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: this.props.username,
      players: this.props.players,
      host: this.props.host,
      inputMessage: "",
      monopolyChat: [],
      color: this.props.color,
    };
  }

  componentDidMount() {
    this.checkKey = this.checkKey.bind(this);
    window.addEventListener('keydown', this.checkKey);

  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.checkKey);
  }

  showBoard(){
    return this.props.players.length > 0 ?
    <div className="main-window">
      <div className="players-container">
        <h1 className="players-title">JUGADORES ({this.props.players.length})</h1>
        <div className="players-list">
          {this.showPlayers()}
        </div>
          {
            this.props.host ? <div className="start-game"><div className="button">Iniciar partida</div></div> : ''
          }
      </div>
      <div className="chat-box">
        <div className="chat-messages">
          {this.displayMessages()}
        </div>
        <div className="chat-input">
          <input 
          type="text"
          autoComplete="false"
          className="send-content" 
          name="inputMessage" 
          onChange={e => this.handleChange(e)} 
          value={this.state.inputMessage}
          placeholder="Enviar un mensaje"
          ></input>
          <div className="send-icon" onClick={ev => this.sendMessage(ev)}><span className="material-icons">send</span></div>
        </div>
      </div>
    </div>
  : 'Cargando lobby...';
  }

  render() {

    return (
      <div className="container">
      {this.showBoard()}
      </div>
    );
  }
}
