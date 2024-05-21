import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/Landing.scss";
import logo from "../../assets/logo.png";
import { Spinner } from "components/ui/Spinner";
import { api, handleError } from "helpers/api";

const Landing = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const warmup = async () => {
    try {
      const response = await api.get("api/v1/cron/end-expired-sessions");
      console.log("Response:", response);
      if (response.status === 200) {
        console.log("Server is ready.");
      } else {
        console.log("Could not reach server. Try again!");
      }
    } catch (error) {
      console.log("Could not reach server:", error);
    }
  };

  const handleLogoClick = () => {
    setIsLoading(true);
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
