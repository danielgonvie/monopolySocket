import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import socket from '../Socket/Socket';
import "./Login.scss";

function Login(props){

  const [username,setUsername] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUsername(e.target.value);
    document.querySelector('#invalid-message').classList.add('hidden');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    socket.emit('checkCurrentUsersMonopoly', username)
  };

  socket.on('monopolyLoginSuccess', (name) => {
    if(name === username){ loginSuccess(name) }
    
  });

  socket.on('monopolyLoginFailName', (name) => {
    loginFailedName(name);
  });

  socket.on('monopolyLoginFailFull', (name) => {
    loginFailedFull();
  });

  useEffect(() => {
  }, [username]);

  const loginSuccess = (name) => {
    socket.off('monopolyLoginSuccess');
    socket.off('monopolyLoginFail');
    const { setUser } = props;
    setUser(name);
    navigate('/monopoly');
  };

  const loginFailedName = (name) => {
    document.querySelector('#invalid-message').innerHTML = name + ' ya está en uso, por favor escoge otro.'
    document.querySelector('#invalid-message').classList.remove('hidden');
  };

  const loginFailedFull = (e) => {
    document.querySelector('#invalid-message').innerHTML = 'La sala está llena'
    document.querySelector('#invalid-message').classList.remove('hidden');
  };
  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form className="login-form" onSubmit={(e) => handleLogin(e)}>
        <div className="login-param">
          <label>Username</label>
          <input
            className="login-field"
            type="text"
            name="username"
            maxLength="16"
            value={username}
            onChange={handleChange}
            required
            placeholder="Username"
          />
          <p id="invalid-message" className="invalid hidden">Ese nombre no está disponible, selecciona otro.</p>
        </div>
        <input className="submit-button" type="submit" value="Join" />
      </form>
    </div>
  );
}

export default Login;