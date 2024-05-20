import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/Landing.scss";
import logo from "../../assets/logo.png";
import { Spinner } from "components/ui/Spinner";

const Landing = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const warmup = async () => {
    try {
      const response = await fetch("/_ah/warmup");
      if (!response) {
        throw new Error("Server did not respond to warmup request.");
      }
      console.log("Server is ready.", isLoading);
    } catch (error) {
      console.log("Could not reach server:", error);
    }
  }

  const handleLogoClick = () => {
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
      {isLoading ? <Spinner /> : ""}
    </div>
  );
};

export default Landing;
