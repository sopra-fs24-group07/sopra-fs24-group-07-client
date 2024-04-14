import React from "react";
import "../../styles/popups/ProfileMenu.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";

const ProfileMenu = ({
  isOpen,
  onClose,
  onProfileClick,
  onProfileSettingsClick,
}) => {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const doLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("id"); // todo depending on our implementation of the get userId from user token call we need to change this
    navigate("/start");
  };

  return (
    <div className="profileMenu-overlay" onClick={onClose}>
      <div className="profileMenu-content" onClick={(e) => e.stopPropagation()}>
        <div className="profileMenu-header">
          <h2>Menu</h2>
          <Button className="red-button" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="profileMenu-actions">
          <Button disabled onClick={onProfileClick}>
            Profile
          </Button>
          <Button onClick={onProfileSettingsClick}>Settings</Button>
          <Button className="red-button" onClick={doLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

ProfileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func.isRequired,
  onProfileSettingsClick: PropTypes.func.isRequired,
};

export default ProfileMenu;
