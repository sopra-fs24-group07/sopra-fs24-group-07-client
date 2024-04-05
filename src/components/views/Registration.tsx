import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="register field">
      <label className="register label">{props.label}</label>
      {props.type === "password" ? (
        <input
          className="register input"
          placeholder="enter here.."
          type="password"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ) : (
        <input
          className="register input"
          placeholder="enter here.."
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      )}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
};

const Registration = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, name, password });
      const response = await api.post("/api/v1/users", requestBody);

      const requestBodyAuth = JSON.stringify({ username, password });
      const responseAuth = await api.post("/api/v1/login", requestBodyAuth);

      // Get the returned user and update a new object.
      const user = new User(responseAuth.data);

      // Store the token into the local storage.
      sessionStorage.setItem("token", user.token);

      // Register successfully worked --> navigate to the route /game in the GameRouter
      navigate("/teams");
    } catch (error) {
      console.log(`Something went wrong during the registration:`, error);
    }
  };

  const goLogin = () => {
    navigate("/login");
  };

  return (
    <BaseContainer>
      <div className="register container">
        <div className="register form">
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField label="Name" value={name} onChange={(n) => setName(n)} />
          <FormField
            label="Password"
            value={password}
            type="password"
            onChange={(n) => setPassword(n)}
          />
          <div className="register button-container">
            <Button width="50%" onClick={() => goLogin()}>
              Login
            </Button>
            <Button
              disabled={!username || !name}
              width="50%"
              onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Registration;
