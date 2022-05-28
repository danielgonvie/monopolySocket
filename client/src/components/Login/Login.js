import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Login.css";

function Login(props){

  const [username,setUsername] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleLogin = (e) => {
    const { setUser } = props;
    e.preventDefault();
    setUser(username);
    navigate('/monopoly');
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
            value={username}
            onChange={handleChange}
            required
            placeholder="Username"
          />
        </div>
        <input className="submit-button" type="submit" value="Join" />
      </form>
    </div>
  );
}

export default Login;