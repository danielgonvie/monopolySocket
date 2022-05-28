import React, { Component } from "react";
import "./MonopolyLobby.css";

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
      return <p key={i}>{player.username} {player.host ? '👑' : ''} </p>
    })
  }

  render() {

    return (
      <div className="main-bar">
        LOBBY
      {this.props.players.length > 0 ? 
      this.showPlayers() 
      : 'Cargando lobby...'}
      </div>
    );
  }
}
