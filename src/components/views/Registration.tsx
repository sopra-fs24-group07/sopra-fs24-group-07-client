import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";
import User from "models/User";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

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
  const [errors, setErrors] = useState({
    username: "",
    name: "",
    password: "",
  });
  const [generalError, setGeneralError] = useState("");

  const validateForm = () => {
    let isValid = true;
    let errors = { username: "", name: "", password: "" };

    if (!username) {
      errors.username = "Username is required";
      isValid = false;
    }

    if (!name) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!password || password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(errors);

    return isValid;
  };

  const doRegister = async () => {
    if (!validateForm()) return;

    try {
      const requestBody = JSON.stringify({ username, name, password });
      const regResponse = await api.post("/api/v1/users", requestBody);

      const requestBodyAuth = JSON.stringify({ username, password });
      const responseAuth = await api.post("/api/v1/login", requestBodyAuth);

      const user = new User(responseAuth.data);
      sessionStorage.setItem("token", user.token);
      sessionStorage.setItem("id", regResponse.data.userId); //TESTING
      if (sessionStorage.getItem("teamUUID")) {
        navigate(`/invitation/${sessionStorage.getItem("teamUUID")}`);
      }
      navigate("/teams");
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
          <div className="register button-container">
            <Button width="50%" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button
              disabled={!username || !name || !password}
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
    </BaseContainer>
  );
};

export default Registration;
