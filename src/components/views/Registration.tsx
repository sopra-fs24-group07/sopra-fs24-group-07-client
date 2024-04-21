import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";
import User from "models/User";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { Spinner } from "components/ui/Spinner";

const FormField = ({ label, value, onChange, type = "text", error }) => (
  <div className="register field">
    <label className="register label">{label}</label>
    <input
      className={`register input ${error ? "input-error" : ""}`}
      placeholder="enter here.."
      type={type}
      value={value}
      onChange={onChange}
    />
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  error: PropTypes.string,
};

const Registration = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    name: "",
    password: "",
    repPassword: "",
  });
  const [generalError, setGeneralError] = useState("");

  const validateForm = () => {
    let isValid = true;
    let errors = { username: "", name: "", password: "", repPassword: "" };

    if (!username) {
      errors.username = "Username is required";
      isValid = false;
    }

    if (!name) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (repPassword !== password) {
      errors.password = "The passwords do not match";
      isValid = false;
    }

    if (!password || password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(errors);
    setTimeout(() => {
      setIsLoading(false); // Set loading to false after the delay and navigation
    }, 500);

    return isValid;
  };

  const doRegister = async () => {
    setIsLoading(true);
    if (!validateForm()) return;

    try {
      const requestBody = JSON.stringify({ username, name, password });
      const regResponse = await api.post("/api/v1/users", requestBody);

      const requestBodyAuth = JSON.stringify({ username, password });
      const responseAuth = await api.post("/api/v1/login", requestBodyAuth);

      const user = new User(responseAuth.data);
      localStorage.setItem("token", user.token);
      localStorage.setItem("id", regResponse.data.userId); //TESTING
      if (sessionStorage.getItem("teamUUID")) {
        navigate(`/invitation/${sessionStorage.getItem("teamUUID")}`);
      } else {
        navigate("/teams");
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : `An unknown error occurred! Contact an administrator: ${error}`;
      setGeneralError(errorMessage);
      console.error("Something went wrong during the registration:", error);
    }
  };

  const getAllErrorMessages = () => {
    const fieldErrors = Object.values(errors).filter((error) => error);
    if (generalError) fieldErrors.push(generalError);

    return fieldErrors;
  };

  return (
    <BaseContainer>
      <div className="register container">
        {sessionStorage.getItem("teamUUID") && (
          <p>Please Register to join the team</p>
        )}
        <div className="register form">
          <FormField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormField
            label="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormField
            label="Repeat Password"
            value={repPassword}
            type="password"
            onChange={(e) => setRepPassword(e.target.value)}
          />
          <div className="register button-container">
            <Button width="50%" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button
              disabled={!username || !name || !password || !repPassword}
              width="50%"
              onClick={doRegister}
            >
              Register
            </Button>
          </div>
        </div>
        {getAllErrorMessages().map((error, index) => (
          <div key={index} className="error-message">
            {error}
          </div>
        ))}
      </div>
      {isLoading ? <Spinner /> : ""}
    </BaseContainer>
  );
};

export default Registration;
