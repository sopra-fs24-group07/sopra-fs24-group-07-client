import React from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useLocation } from "react-router-dom";
import "styles/popups/Tutorial.scss";

const TutorialPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const location = useLocation();
  const dashboardTutorial = location.pathname.includes("/teams/") && location.pathname.split("/").length === 3;
  const overviewTutorial = location.pathname === "/teams";

  if (overviewTutorial) {
    return (
        <div className="tutorial content">
          <h2>Tutorial</h2>
          <p>Welcome to the team overview tutorial!</p>
          <Button onClick={onClose}>Close</Button>
        </div>
    );
  } else if (dashboardTutorial) {
    return (
        <div className="tutorial content">
          <h2>Tutorial</h2>
          <p>Welcome to the team dashboard tutorial!</p>
          <Button onClick={onClose}>Close</Button>
        </div>
    
    );
  }
};

TutorialPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TutorialPopup;