import React, { Component } from "react";
import "./MonopolyLobby.scss";

export default class MonopolyLobby extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: this.props.username,
      players: this.props.players,
      host: this.props.host
    };
  }

  componentDidMount() {
  }

  showPlayers(){
    console.log(this.props.players, "hola propbando")
    return this.props.players.map((player, i) => {
      return <p className="player-name" key={i}>{player.username} {player.host ? '👑' : ''} </p>
    })
  }

  showLobby(){
    return this.props.players.length > 0 ?
      <div className="main-window">
        <div className="players-container">
          <h1 className="players-title">Jugadores</h1>
          <div className="players-list">
            {this.showPlayers()}
          </div>
            {
              this.state.host ? <div className="start-game">Iniciar partida</div> : ''
            }
        </div>
        <div className="chat-box">
        </div>
      </div>
    : 'Cargando lobby...'
  }

  render() {

    return (
      <div className="container">
      {this.showLobby()}
      </div>
    );
  }
}
