import React from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/Landing.scss";
import logo from "../../assets/logo.png";

const Landing = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing container">
      <div className="landing logo" onClick={handleLogoClick}>
        <img src={logo} alt="Logo" />
      </div>
      <p className="landing click-text">
        {" "}
        {"<<Click the logo to continue!>>"}{" "}
      </p>
    </div>
  );
};

export default Landing;
