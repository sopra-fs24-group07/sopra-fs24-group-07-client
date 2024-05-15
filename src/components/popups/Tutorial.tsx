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

    return (
        
        <div className="tutorial content">
            <p>Welcome to the tutorial!</p>
        {overviewTutorial ? (
            <div>
            <h1>Team Overview Tutorial</h1>
            </div>
        ) : (
            <div>
            <h1>Team Dashboard Tutorial</h1>
            <h3>Kanbanboard</h3>
            <p>Text copz paste</p>
            </div>
        )}
          <Button onClick={onClose}>Got it!</Button>  
        </div>
    );
};

TutorialPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TutorialPopup;