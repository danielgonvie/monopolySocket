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
      console.log(user, "fuiste kicked?")
      socket.emit('beenKickedMonopoly', user);
      if(user === username){ navigate('/') }
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
      players.length !== 0 ? <MonopolyLobby username={username} players={players} host={host}></MonopolyLobby> : 'Cargando el loby...'
      }
    </div>
  );
}

export default MonopolyGame;