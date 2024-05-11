import React from "react";
import "../../styles/popups/ProfileMenu.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import { PopupHeader } from "../ui/PopupHeader";

const ProfileMenu = ({
  isOpen,
  onClose,
  onProfileClick,
  onProfileSettingsClick,
}) => {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const doLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id"); // todo depending on our implementation of the get userId from user token call we need to change this
    navigate("/start");
  };

  return (
    <div className="profileMenu-overlay" onClick={onClose}>
      <div className="profileMenu-content" onClick={(e) => e.stopPropagation()}>
        <PopupHeader onClose={onClose} title="Menu" />
        <div className="profileMenu-actions">
          <Button width="100%" className="bts" onClick={onProfileClick}>
            Profile
          </Button>
          <Button width="100%" className="red-button bts" onClick={doLogout}>
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
