import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";
import User from "models/User";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Spinner } from "components/ui/Spinner";
import logo from "../../assets/logo.png";
import LogRegHeader from "./LogRegHeader";
import { FormField } from "../ui/FormField";
import { validateRegistrationForm } from "../utilities/ValidateForm";

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

  const doRegister = async () => {
    setIsLoading(true);
    const isValid = validateRegistrationForm({
      username,
      name,
      password,
      repPassword,
      setErrors,
      setIsLoading
    });

    if (!isValid) return;

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
    <div>
      <LogRegHeader></LogRegHeader>
      <BaseContainer>
        <div className="register center-align">
          <img className="register logo" src={logo} alt="Logo" />
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
            <label className="register message">
              Already haven an account?
            </label>
            <Button width="60%" onClick={() => navigate("/login")}>
              Go to Login
            </Button>
          </div>
        </div>
        {isLoading ? <Spinner /> : ""}
      </BaseContainer>
    </div>
  );
};

export default Registration;
