import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { api } from "helpers/api";
import User from "models/User";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";

const FormField = ({ label, value, onChange, type = "text" }) => (
  <div className="register field">
    <label className="register label" htmlFor={label}>
      {label}
    </label>
    <input
      className="register input"
      placeholder="enter here.."
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      id={label}
    />
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
};

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/api/v1/login", requestBody);
      const user = new User(response.data);
      sessionStorage.setItem("token", user.token);
      navigate("/teams");
    } catch (error) {
      setError("Failed to login. Please check your username and password.");
      console.error(`Something went wrong during the login:`, error);
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField label="Username" value={username} onChange={setUsername} />
          <FormField
            label="Password"
            value={password}
            type="password"
            onChange={setPassword}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="50%"
              onClick={doLogin}
            >
              Login
            </Button>
            <Button width="50%" onClick={() => navigate("/register")}>
              Register
            </Button>
          </div>
        </div>
        {error && <p className="login error">{error}</p>}
      </div>
    </BaseContainer>
  );
};

export default Login;
