// genau wie Create team in TeamsOverview

// Tutorial ist nicht mit ein Button verbunden

import React, { useState } from "react";
import { Button } from "components/ui/Button";
import "styles/popups/Tutorial.scss";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { isNullishCoalesce } from "typescript";

const Tutorial = () => {
    const navigate = useNavigate();
    const [isTutorialOpen, setTutorialOpen] = useState(
      localStorage.getItem("isNewUser") === "true" // Check localStorage value here
    );
  
    const closeTutorial = () => {
      setTutorialOpen(false);
      localStorage.setItem("isNewUser", null); // Update localStorage value after tutorial has been displayed
    };

  const goToTeamsOverview = () => {
    closeTutorial();
    navigate("/teams");
  };

  if (localStorage.getItem("isNewUser")) {

  return isTutorialOpen ? (
    <div className="tutorial container">
      <div className="tutorial content">
        <h1>Welcome to Our App!</h1>
        <p>
          This is a quick tutorial to help you get started. Youll find all the
          main features in the navigation bar on the left. You can create teams,
          join teams, and manage your tasks within those teams.

          Click on the "Create Team" button to create your first team! After setting a 
          team name, you can either write your own description, or click on the orange 
          wand button to automatically generate a team description.


        

        </p>
        <Button className="tutorial-button" onClick={closeTutorial}>
          Got it!
        </Button>
      </div>
    </div>
  ) : null;
};

export default Tutorial;