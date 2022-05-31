import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import MonopolyLobby from "../MonopolyLobby/MonopolyLobby";
import socket from '../Socket/Socket';
import "./MonopolyGame.scss";

function MonopolyGame(props){
  const location = useLocation();
  const navigate = useNavigate();
  const [username] = useState(props.username);
  const [color, setColor] = useState('#fe1010');
  const [players,setPlayers] = useState([]);
  const [hasBegun,setHasBegun] = useState(false);
  const [loading,setLoading] = useState(true);
  const [host,setHost] = useState(false);
  const [monopolyChat,setMonopolyChat] = useState([]);
  const [monopolyChars,setMonopolyChars] = useState(['#fe1010','#0070b8','#008000','#f2dd00','#ffb6c1','#e28112','#9c27b9','#542c0a']);
  //rojo, azul, verde. amarillo, rosa, naranja, morado, marron

  useEffect(()=>{
    const username = props.username;
    socket.emit('connectedMonopoly', username);
    socket.on('someoneMonopoly', ( playersArr ) => {
      //Seteamos para el usuario la cantidad de jugadores actuales y le decimos al front quien es el host.
      let playerIdx = playersArr.findIndex((obj) => {
        return obj.username === username;
      });
      if (playerIdx !== -1) {
        setPlayers(playersArr)
        setHost(playersArr[playerIdx].host)
      } else {
        socket.emit('leftMonopoly', username);
      }
    })

    socket.emit('hasBegun');

    socket.on('matchStarted', (hasBegunServer) => {
      setHasBegun(hasBegunServer);
      setLoading(false);
    })

    socket.on('youBeenKickedMonopoly', (user) => {
      let playerIdx = players.findIndex((obj) => {
        return obj.host === true;
      });
      if (playerIdx !== -1) {
        if(players[playerIdx].username === user){socket.emit(`newHostMonopoly`, players[playerIdx].username)}
      }
      socket.emit('beenKickedMonopoly', user);
      if(user === username){ navigate('/') }
    })

    socket.on('hasJoinedMonopoly', (user, playersArr) => {
      setPlayers(playersArr)
      setMonopolyChat(monopolyChat => [...monopolyChat, {username: user, type: 'join'}]);
      let nameIdx = playersArr.findIndex(player => player.username === user);
      if(username === user) {
        setColor(playersArr[nameIdx].color)};
    })

    socket.on('leftMonopoly', (user) => {
      setMonopolyChat(monopolyChat => [...monopolyChat, {username: user, type: 'left'}])
    })

    socket.on('setNewHostMonopoly', (user) => {
      setMonopolyChat(monopolyChat => [...monopolyChat, {username: user, type: 'host'}])
    })

    socket.on('updateMessagesMonopoly', (user, message, color ) => {
      setMonopolyChat(monopolyChat => [...monopolyChat, { username: user, message, color }]);
      // let chatWindow = document.querySelector('.chat-messages')
      // chatWindow.scrollTop = chatWindow.scrollHeight;
    })

    
    document.onmouseover = function() {
      window.innerDocClick = true;
    }
  
    document.onmouseleave = function() {
        window.innerDocClick = false;
    }

    window.onpopstate = function() {
        if (!window.innerDocClick) {
          socket.emit('someoneLeftMonopoly', username);
        }
    }
  },[])

  const changeColor = (color) => {
    setColor(color);
    socket.emit('changedColorMonopoly', username, color)
  };

  return (
    <div className="main-bar">
      <p>Hola {username}</p>
      {loading ?
      <p>Cargando...</p> :
      hasBegun ? 
      <h1>MONOPOLY BOARD GAME ~ el juego</h1> :
      players.length !== 0 ? <MonopolyLobby username={username} players={players} host={host} monopolyChat={monopolyChat} monopolyChars={monopolyChars} color={color} changeColor={changeColor}></MonopolyLobby> : 'Cargando el loby...'
      }
    </div>
  );
}

export default MonopolyGame;