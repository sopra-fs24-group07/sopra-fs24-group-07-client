import React from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";

const TutorialPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Tutorial</h2>
        <p>Welcome to the tutorial!</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

TutorialPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TutorialPopup;