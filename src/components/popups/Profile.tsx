import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import { User } from "types";
import "../../styles/popups/ProfileMenu.scss";

import { IoMdCloseCircle, IoMdCloseCircleOutline } from "react-icons/io";
import { MdModeEditOutline, MdOutlineModeEdit } from "react-icons/md";
import IconButton from "../ui/IconButton";

const Player = ({ user }) => (
  <div className="profile container">
    <div className="profile attribute">username: {user.username}</div>
    <div className="profile attribute">name: {user.name}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object.isRequired,
};

const Profile = ({ isOpen, onClose, message, onSettingsOpen }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (!isOpen) return;

      let token = localStorage.getItem("token");
      let userId = localStorage.getItem("id");

      try {
        const response = await api.get(`/api/v1/users/${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        setUser({
          id: response.data.userId,
          username: response.data.username,
          name: response.data.name,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to fetch user data");
      }
    }

    fetchUser();
  }, [isOpen]);

  const openSettings = () => {
    onSettingsOpen();
  };

  if (!isOpen) return null;

  return (
    <div className="profileMenu-overlay" onClick={onClose}>
      <div className="profileMenu-content" onClick={(e) => e.stopPropagation()}>
        <div className="profileMenu-header">
          <h2>Profile</h2>
          <IconButton
            hoverIcon={IoMdCloseCircle}
            icon={IoMdCloseCircleOutline}
            onClick={onClose}
            className="red-icon"
            style={{ scale: "1.8", marginLeft: "20px", marginRight: "5px" }}
          />
        </div>
        {message && <div className="confirmation-message">{message}</div>}
        {user && <Player user={user} />}
        <div className="profileMenu-header">
          <IconButton
            hoverIcon={MdModeEditOutline}
            icon={MdOutlineModeEdit}
            onClick={openSettings}
            className="green-icon"
            style={{ scale: "1.8", marginTop: "15px", marginLeft: "10px" }}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

Profile.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string,
  onSettingsOpen: PropTypes.func,
};

export default Profile;
