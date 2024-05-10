import React from "react";
import "../../styles/popups/ProfileMenu.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";

import { IoMdCloseCircle, IoMdCloseCircleOutline } from "react-icons/io";
import IconButton from "../ui/IconButton";

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
        <div className="profileMenu-header">
          <h2>Menu</h2>
          <IconButton
            hoverIcon={IoMdCloseCircle}
            icon={IoMdCloseCircleOutline}
            onClick={onClose}
            className="blue-icon"
            style={{ scale: "1.8", marginLeft: "20px", marginRight: "5px" }}
          />
        </div>
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
