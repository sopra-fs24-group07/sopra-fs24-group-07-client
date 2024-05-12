import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import { User } from "types";
import "../../styles/popups/ProfileMenu.scss";

import { IoMdCloseCircle, IoMdCloseCircleOutline } from "react-icons/io";
import { MdModeEditOutline, MdOutlineModeEdit } from "react-icons/md";
import IconButton from "../ui/IconButton";
import { PopupHeader } from "../ui/PopupHeader";
import FormField from "../ui/FormField";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  const doLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id"); // todo depending on our implementation of the get userId from user token call we need to change this
    navigate("/start");
  };

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

  const doClose = () => {
    onClose();
    message = "";
  };

  if (!isOpen) return null;

  return (
    <div className="profileMenu-overlay" onClick={onClose}>
      <div className="profileMenu-content" onClick={(e) => e.stopPropagation()}>
        <PopupHeader onClose={onClose} title="Profile" />
        {user && (
          <div>
            <FormField
              label="Username"
              type="text"
              value={user.username}
              onChange={user.username}
              disabled={true}
            >
              <IconButton
                hoverIcon={MdModeEditOutline}
                icon={MdOutlineModeEdit}
                onClick={openSettings}
                title={"Edit Profile"}
                className="blue-icon"
                style={{
                  scale: "1.8",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
              />
            </FormField>
            <FormField
              label="Name"
              type="text"
              value={user.name}
              onChange={user.name}
              disabled={true}
            />
          </div>
        )}
        <Button width="30%" className="red-button bts" onClick={doLogout}>
          Logout
        </Button>
        {message && <div className="confirmation-message">{message}</div>}
        <div className="profileMenu-header"></div>
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
