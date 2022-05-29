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
      let chatWindow = document.querySelector('.chat-messages')
      chatWindow.scrollTop = chatWindow.scrollHeight;
    })

    socket.on('hasJoinedMonopoly', (username) => {
      console.log("alguien se ha unido");
      this.setState({ ...this.state, monopolyChat: [...this.state.monopolyChat, {username, type: 'join'}]})
    })

    socket.on('leftMonopoly', (username) => {
      console.log("alguien se ha idp");
      this.setState({ ...this.state, monopolyChat: [...this.state.monopolyChat, {username, type: 'left'}]})
    })

    socket.on('newHostMonopoly', (username) => {
      console.log("entró al event del new host");
      this.setState({ ...this.state, monopolyChat: [...this.state.monopolyChat, {username, type: 'host'}]})
    })

    document.addEventListener('keydown', this.checkKey.bind(this));

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

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  };

  displayMessages = () => {
    const messages = this.state.monopolyChat;
    return messages.map((message, i) => {
    if (message.color) {
      return <div key={i} className="chat-bubble">
        <h1 className={"message-author " + message.color}>{message.username + ':'}</h1>
        <p className="message-text">{message.message}</p>
      </div>
    } else if (message.type === 'join') {
      return <div key={i} className="chat-bubble">
        <p className="message-text">{message.username} se ha unido a la sala.</p>
      </div>
    } else if (message.type === 'left'){
      return <div key={i} className="chat-bubble">
        <p className="message-text">{message.username} se ido de la sala.</p>
      </div>
    } else if (message.type === 'host'){
      return <div key={i} className="chat-bubble">
        <p className="message-text">{message.username} es el nuevo host de la sala.</p>
      </div>
    }
    }
  )
  }

  sendMessage = (e) => {
        socket.emit(`newMessageMonopoly`, this.state.username, this.state.inputMessage, this.state.color)
        this.setState({ ...this.state, inputMessage: ""})
  }

  checkKey (key) {
    if(key.key === 'Enter'){
      this.sendMessage()
    }
  }

  render() {

    return (
      <div className="container">
      {this.showLobby()}
      </div>
    );
  }
}
