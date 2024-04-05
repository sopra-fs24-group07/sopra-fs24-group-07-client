import React from "react";
import "../../styles/popups/ProfileMenu.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";

const Profile = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="profileMenu-overlay" onClick={onClose}>
      <div className="profileMenu-content" onClick={(e) => e.stopPropagation()}>
        <Button className="red-button" onClick={onClose}>
          Close
        </Button>
        <h2>Profile</h2>
      </div>
    </div>
  );
};

Profile.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Profile;
