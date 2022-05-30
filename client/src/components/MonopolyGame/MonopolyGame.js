import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import MonopolyLobby from "../MonopolyLobby/MonopolyLobby";
import socket from '../Socket/Socket';
import "./MonopolyGame.scss";

function MonopolyGame(props){
  const location = useLocation();
  const navigate = useNavigate();
  const [username] = useState(props.username);
  const [players,setPlayers] = useState([]);
  const [hasBegun,setHasBegun] = useState(false);
  const [loading,setLoading] = useState(true);
  const [host,setHost] = useState(false);
  const [monopolyChat,setMonopolyChat] = useState([{username: "ductor", message:"hholaa", color: "red"}]);


  useEffect(()=>{
    console.log('component mounted!')
    const username = props.username;
    socket.emit('connectedMonopoly', username);
    socket.on('someoneMonopoly', ( playersArr ) => {
      //Seteamos para el usuario la cantidad de jugadores actuales y le decimos al front quien es el host.
      let playerIdx = playersArr.findIndex((obj) => {
        return obj.username === username;
      });
      console.log("cuando se VAAAAAA", playersArr, playerIdx);
      if (playerIdx !== -1) {
        setPlayers(playersArr)
        setHost(playersArr[playerIdx].host)
        console.log("vas a mandar elvento o que");
      } else {
        socket.emit('leftMonopoly', username);
        console.log("No está el men");  
      }
      
      console.log("El estado de los jugadores", playersArr)
    })

    socket.emit('hasBegun');

    socket.on('matchStarted', (hasBegunServer) => {
      setHasBegun(hasBegunServer);
      setLoading(false);
      console.log("La partida ha comenzado?", hasBegun)
    })

    socket.on('youBeenKickedMonopoly', (user) => {
      console.log(user, "fuiste kicked?");
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
      console.log("alguien se ha unido");
      setPlayers(playersArr)
      setMonopolyChat(monopolyChat => [...monopolyChat, {username: user, type: 'join'}])
    })

    socket.on('leftMonopoly', (user) => {
      console.log("alguien se ha idp");
      setMonopolyChat(monopolyChat => [...monopolyChat, {username: user, type: 'left'}])
    })

    socket.on('setNewHostMonopoly', (user) => {
      console.log("entró al event del new host");
      setMonopolyChat(monopolyChat => [...monopolyChat, {username: user, type: 'host'}])
    })

    socket.on('updateMessagesMonopoly', (user, message, color ) => {
      console.log(monopolyChat, "AVER PORFAVOR", user, message, color )
      setMonopolyChat(monopolyChat => [...monopolyChat, { username: user, message, color }]);
      console.log("NO SE QUE PASA >", monopolyChat)
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
          console.log(location.pathname);
          socket.emit('someoneLeftMonopoly', username);
        }
    }
  },[])


  return (
    <div className="main-bar">
      <p>Hola {username}</p>
      {loading ?
      <p>Cargando...</p> :
      hasBegun ? 
      <h1>MONOPOLY BOARD GAME ~ el juego</h1> :
      players.length !== 0 ? <MonopolyLobby username={username} players={players} host={host} monopolyChat={monopolyChat}></MonopolyLobby> : 'Cargando el loby...'
      }
    </div>
  );
}

export default MonopolyGame;