import React from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/Landing.scss";
import logo from "../../assets/logo.png";

const Landing = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const warmup = async () => {
      try {
        const response = await fetch("/_ah/warmup");
        if (!response) {
          throw new Error("Server did not respond to warmup request.");
        }
      console.log("Server is ready.");
      } catch (error) {
        console.log("Could not reach server:", error);
      }
    }

    warmup();
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
