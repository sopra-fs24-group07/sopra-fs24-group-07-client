// ProfilePopup.js
import React from "react";
import "../../styles/popups/ProfileMenu.scss";
import PropTypes from "prop-types";

const Profile = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="profileMenu-overlay" onClick={onClose}>
      <div className="profileMenu-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}>Close</button>
        <h2>Profile</h2>
        {/* Add your profile content here */}
      </div>
    </div>
  );
};

Profile.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Profile;
