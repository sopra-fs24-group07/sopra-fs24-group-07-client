import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { api } from "helpers/api";
import User from "models/User";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";

//NEW FORMFIELD: WITHOUT CODE REPETITION
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

// SEE NEW TYPE "type"
FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
};

const Spinner = () => (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000 // Ensures it is on top of other elements
  }}>
    <div style={{
      width: "40px",
      height: "40px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #3498db",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    }} />
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // NEW SET ERROR METHOD
  const [isLoading, setIsLoading] = useState(false);

  const doLogin = async () => {
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
      // ERROR HANDLING; IF THE BACKEND DOESNT RESPOND PROPERLY TELL THE USER PW OR UN ARE WRONG
      setError("Failed to login. Please check your username and password.");
      // ALSO CONSOLE ERROR FOR THE ERROR: WOULD SHOW IN CONSOLE IF ERROR IS NOT JUST INVALID CREDENTIALS
      console.error("Something went wrong during the login:", error);
    }
    setTimeout(() => {
      setIsLoading(false);  // Set loading to false after the delay and navigation
    }, 500);
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField label="Username" value={username} onChange={setUsername} />{" "}
          {/* FORMFIELD FOR USERNAME, NO VALIDATION FROM FRONTEND */}
          <FormField // FORMFIELD FOR PASSWORD, NO VALIDATION FROM FRONTEND
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
      {isLoading ? <Spinner /> : ""}
    </BaseContainer>
  );
};

export default Login;
