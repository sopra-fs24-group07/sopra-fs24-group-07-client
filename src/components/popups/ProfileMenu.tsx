// ProfileMenu.js
import React from "react";
import "../../styles/popups/ProfileMenu.scss";
import PropTypes from "prop-types";

const ProfileMenu = ({ isOpen, onClose, onProfileClick }) => {
  if (!isOpen) return null;

  return (
    <div className="profileMenu-overlay" onClick={onClose}>
      <div className="profileMenu-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}>Close</button>
        <h2>Settings</h2>
        {/* Add your interactive elements here */}
        <button onClick={onProfileClick}>Profile</button>{" "}
        {/* Button to open ProfilePopup */}
      </div>
    </div>
  );
};

ProfileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func.isRequired, // Function to handle opening ProfilePopup
};

export default ProfileMenu;
