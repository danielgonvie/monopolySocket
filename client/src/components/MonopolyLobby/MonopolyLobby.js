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
      monopolyChat: [],
      color: this.props.color,
    };
  }

  componentDidMount() {
    this.checkKey = this.checkKey.bind(this)

    window.addEventListener('keydown', this.checkKey);

  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.checkKey);
  }

  kickPlayer(username){
    socket.emit('kickPlayerMonopoly', username);
  }

  showColorSelector(){
    let colorPicker = document.querySelector('.colorSelector');
    colorPicker.classList.contains('hidden') ?
    colorPicker.classList.remove('hidden') :
    colorPicker.classList.add('hidden')
  }

  showPlayers(){
    return this.props.players.map((player, i) => {
      return <div className="player-name" key={i}>{player.host ? '👑' : ''} {player.username}
        {this.showColorPicker(player)}
      {!player.host && this.props.host && player.username !== this.props.username ? <div className="cross-kick" onClick={(e) => this.kickPlayer(player.username)}>❌</div> : ''} </div>
    })
  }

  showColorPicker(player){
    if (this.props.username === player.username) {
      return <div className="colorPicker" style={{backgroundColor: this.props.color}} onClick={(e) => this.showColorSelector()} >
      <div className="colorSelector hidden"> 
      {this.props.monopolyChars.map((color, i) => {
        if(color === this.props.color){
          return <div key={i} className='monopoly-character colorSelected' style={{backgroundColor: color}}></div> 
        } else if (this.props.players.find(player => player.color === color) === undefined) {
          return <div key={i} className={'monopoly-character available'} style={{backgroundColor: color}} onClick={(e) => this.props.changeColor(color)}></div> 
        } else {
          return <div key={i} className={'monopoly-character unavailable'} style={{backgroundColor: color}}></div> 
        }
      })}
      </div>
    </div>
    } else {
      return <div className="colorPicker" style={{backgroundColor: player.color}} >
      </div>
    }
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
    const messages = this.props.monopolyChat;
    return messages.map((message, i) => {
    if (message.color) {
      return <div key={i} className="chat-bubble">
        <h1 className="message-author" style={{color: message.color}}>{message.username + ':'}</h1>
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
        console.log("cuantas veces entras aquí?");
        socket.emit(`newMessageMonopoly`, this.props.username, this.state.inputMessage, this.props.color)
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
