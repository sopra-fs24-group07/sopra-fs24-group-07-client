import React from "react";
import "../../styles/popups/ProfileMenu.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";

const ProfileSettings = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="profileMenu-overlay" onClick={onClose}>
      <div className="profileMenu-content" onClick={(e) => e.stopPropagation()}>
        <Button className="red-button" onClick={onClose}>
          Close
        </Button>
        <h2>Settings</h2>
      </div>
    </div>
  );
};

ProfileSettings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProfileSettings;
