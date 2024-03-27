import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import logo from "../../logo.png";

const Landing = () => {
  const navigate = useNavigate();

  const doContinue = () => {
    navigate("/login");
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="logo container">
          <Button onClick={doContinue}>
            <img src={logo} alt="Logo" />
          </Button>
        </div>
      </div>
      <p
        className="login text"
        style={{ textAlign: "center", marginTop: "0.5em" }}
      >
        {"<<Click the logo to continue!>>"}
      </p>
    </BaseContainer>
  );
};

export default Landing;
