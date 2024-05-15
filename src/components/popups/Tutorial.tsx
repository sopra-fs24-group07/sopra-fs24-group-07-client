// genau wie Create team in TeamsOverview

// Tutorial ist nicht mit ein Button verbunden

import React, { useState } from "react";
import { Button } from "components/ui/Button";
import "styles/views/Tutorial.scss";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Tutorial = () => {
    const navigate = useNavigate();
    const [isTutorialOpen, setTutorialOpen] = useState(
      localStorage.getItem("isNewUser") === "true" // Check localStorage value here
    );
  
    const closeTutorial = () => {
      setTutorialOpen(false);
      localStorage.setItem("isNewUser", "false"); // Update localStorage value after tutorial has been displayed
    };

  const goToTeamsOverview = () => {
    closeTutorial();
    navigate("/teams");
  };

  return isTutorialOpen ? (
    <div className="tutorial container">
      <div className="tutorial content">
        <h1>Welcome to Our App!</h1>
        <p>
          This is a quick tutorial to help you get started. You'll find all the
          main features in the navigation bar on the left. You can create teams,
          join teams, and manage your tasks within those teams.
        </p>
        <Button className="tutorial-button" onClick={closeTutorial}>
          Got it!
        </Button>
      </div>
    </div>
  ) : null;
};

export default Tutorial;