import React, { Component } from "react";
import "./MonopolyLobby.scss";

import socket from '../Socket/Socket';

export default class MonopolyLobby extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: this.props.username,
      players: this.props.players,
      host: this.props.host,
      inputMessage: "",
      monopolyChat: [{username: "ductor", message:"hholaa", color: "red"}],
      color: "blue",
    };
  }

  componentDidMount() {
    socket.on('updateMessagesMonopoly', (username, message, color) => {
      this.setState({ ...this.state, monopolyChat: [...this.state.monopolyChat, {username, message, color}]})
    })
  }

  kickPlayer(username){
    socket.emit('kickPlayerMonopoly', username);
  }

  showPlayers(){
    console.log(this.props.players, "hola propbando")
    return this.props.players.map((player, i) => {
      return <div className="player-name" key={i}>{player.username} {player.host ? '👑' : ''} {!player.host && player.username !== this.props.username ? <div className="cross-kick" onClick={(e) => this.kickPlayer(player.username)}>❌</div> : ''} </div>
    })
  }

  showLobby(){
    return this.props.players.length > 0 ?
      <div className="main-window">
        <div className="players-container">
          <h1 className="players-title">JUGADORES ({this.props.players.length})</h1>
          <div className="players-list">
            {this.showPlayers()}
          </div>
            {
              this.state.host ? <div className="start-game"><div className="button">Iniciar partida</div></div> : ''
            }
        </div>
        <div className="chat-box">
          <div className="chat-messages">
            {this.displayMessages()}
          </div>
          <div className="chat-input">
            <input 
            type="text"
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
    : 'Cargando lobby...'
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  };

  displayMessages = () => {
    const messages = this.state.monopolyChat;
    return messages.map((message, i) => 
    <div key={i} className="chat-bubble">
      <h1 className={"message-author " + message.color}>{message.username} :</h1>
      <p className="message-text">{message.message}</p>
    </div>
  )
  }

  sendMessage = (e) => {
        socket.emit(`newMessageMonopoly`, this.state.username, this.state.inputMessage, this.state.color)
        this.setState({ ...this.state, inputMessage: ""})
  }

  render() {

    return (
      <div className="container">
      {this.showLobby()}
      </div>
    );
  }
}
