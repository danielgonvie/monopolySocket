import React, { Component } from "react";
import { useLocation } from 'react-router-dom'
import MonopolyLobby from "../MonopolyLobby/MonopolyLobby";
import socket from '../Socket/Socket';
import "./MonopolyGame.css";

export default class MonopolyGame extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: this.props.username,
      players: [],
      hasBegun: false,
      loading: true,
      host: false
    };
  }

  componentDidMount() {
    const username = this.props.username;
    socket.emit('connectedMonopoly', this.state.username);
    socket.on('someoneMonopoly', ( players ) => {
      //Seteamos para el usuario la cantidad de jugadores actuales y le decimos al front quien es el host.
      let playerIdx = players.findIndex((obj) => {
        return obj.username === this.state.username;
      });
      console.log("cuando se VAAAAAA", players, playerIdx);
      playerIdx !== -1 ?
      this.setState({
        ...this.state,
        players,
        host: players[playerIdx].host
      }) : console.log("No está el men");
      
      
      console.log("El estado de los jugadores", this.state.players)
    })

    socket.emit('hasBegun');

    socket.on('matchStarted', (hasBegun) => {
      this.setState({
        ...this.state,
        hasBegun,
        loading: false
      })
      console.log("La partida ha comenzado?", this.state.hasBegun)
    })
    
    document.onmouseover = function() {
      window.innerDocClick = true;
    }
  
    document.onmouseleave = function() {
        window.innerDocClick = false;
    }

    window.onpopstate = function() {
        if (!window.innerDocClick) {
          const location = useLocation();
          console.log(location.pathname);
          socket.emit('someoneLeftMonopoly', username);
        }
    }
  }

  render() {

    return (
      <div className="main-bar">
        <h1>Componente Monopoly</h1>
        <p>Hola {this.state.username} {this.state.host ? '👑' : ''}</p>
        {this.state.loading ?
        <p>Cargando...</p> :
        this.state.hasBegun ? 
        <h1>MONOPOLY BOARD GAME ~ el juego</h1> :
        this.state.players.length !== 0 ? <MonopolyLobby username={this.state.username} players={this.state.players} host={this.state.host}></MonopolyLobby> : 'Cargando el loby...'
        }
      </div>
    );
  }
}
