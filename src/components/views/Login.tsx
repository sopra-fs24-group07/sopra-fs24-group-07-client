import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { api } from "helpers/api";
import User from "models/User";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Spinner } from "components/ui/Spinner";
import logo from "../../assets/logo.png";
import LogRegHeader from "./LogRegHeader";
import FormField from "../ui/FormField";
import { useNotification } from "../popups/NotificationContext";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // NEW SET ERROR METHOD
  const [isLoading, setIsLoading] = useState(false);
  const [secret, setSecret] = useState(0);
  const { notify } = useNotification();

  const incSecret = () => {
    setSecret(secret + 1);
  };

  const doLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/api/v1/login", requestBody);
      const user = new User(response.data);
      localStorage.setItem("token", user.token);
      localStorage.setItem("id", user.userId);
      if (sessionStorage.getItem("teamUUID")) {
        navigate(`/invitation/${sessionStorage.getItem("teamUUID")}`);
      } else {
        navigate("/teams");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        if (error.response.status === "BAD_REQUEST") {
          notify("error", `An error occurred! Please try again or contact and administrator: ${error.response.data.message} (${error.response.status})`);

        } else {
          setError(`Invalid credentials! Please try again. (${error.response.data.message})`);
        }
      } else {
        const errorMessage = `An unknown error occurred! Contact an administrator: ${error} (${error.code})`;
        notify("error",errorMessage);
      }
    }
    setTimeout(() => {
      setIsLoading(false); // Set loading to false after the delay and navigation
    }, 500);
  };

  return (
    <div>
      <LogRegHeader />
      <BaseContainer>
        <div className="login center-align">
          {secret >= 5 && (
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/DLzxrzFCyOs?autoplay=1&mute=0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
          {secret < 5 && (
            <img
              className="login logo"
              src={logo}
              alt="Logo"
              onClick={incSecret}
            />
          )}
          <div className="login container">
            {sessionStorage.getItem("teamUUID") && (
              <p>Please Login to join the team</p>
            )}
            <div className="login form">
              <form onSubmit={doLogin}>
                <FormField
                  label="Username"
                  value={username}
                  onChange={setUsername}
                />{" "}
                <FormField
                  label="Password"
                  value={password}
                  type="password"
                  onChange={setPassword}
                />
                {error && <p className="login error">{error}</p>}
                {!error && <p className="login error"></p>}
                <div className="login button-container">
                  <Button
                    disabled={!username || !password}
                    width="65%"
                    type="submit"
                    className="login-button"
                  >
                    Login
                  </Button>
                </div>
              </form>
            </div>

            <label className="login message">Don&#39;t have an acoount?</label>
            <Button
              className="login-button"
              width="60%"
              onClick={() => navigate("/register")}
            >
              Go to Register
            </Button>
          </div>
        </div>
        {isLoading ? <Spinner /> : ""}
      </BaseContainer>
    </div>
  );
};

export default Login;
