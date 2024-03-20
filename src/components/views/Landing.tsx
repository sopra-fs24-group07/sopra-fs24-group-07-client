import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Logo } from "components/ui/logoImg";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Landing = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const doContinue = () => {
    sessionStorage.setItem("token", "123");
    navigate("/game");
  };

  const doLogin = async () => {
    try {
      setUsername("username");
      setName("Name");
      const requestBody = JSON.stringify({ username, name });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      sessionStorage.setItem("token", user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };
/*
  return (
    <BaseContainer>
      <div className="login container">
        <Button onClick={doContinue}>
          <Logo margin="1em" />
        </Button>
      </div>
      <p className="login text" style={{ textAlign: 'center', marginTop: '0.5em' }}>
        {"<<Click the logo to continue!>>"}
      </p>
    </BaseContainer>
  );
 */
  return (
    <BaseContainer>
      <div className="login container">
        <Button onClick={doContinue}>
          <Logo margin="1em" />
        </Button>
      </div>
      <p className="login text" >
        {"<<Click the logo to continue!>>"}
      </p>
    </BaseContainer>
  );
};

export default Landing;
