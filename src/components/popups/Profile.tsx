import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import { User } from "types";
import "../../styles/popups/ProfileMenu.scss";

const Player = ({ user }) => (
  <div className="profile container">
    <div className="profile attribute">id: {user.id}</div>
    <div className="profile attribute">username: {user.username}</div>
    <div className="profile attribute">name: {user.name}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object.isRequired,
};

const Profile = ({ isOpen, onClose }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (!isOpen) return;

      let token = sessionStorage.getItem("token");
      let userId = sessionStorage.getItem("id"); // todo might need to change this depending on out implementation of our token to userId methods

      try {
        const response = await api.post(`/api/v1/users/${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        // todo The following 4 lines set the user info to the info from the backend
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

  if (!isOpen) return null;

  return (
    <div className="profileMenu-overlay" onClick={onClose}>
      <div className="profileMenu-content" onClick={(e) => e.stopPropagation()}>
        <div className="profileMenu-header">
          <h2>Profile</h2>
          <Button className="red-button" onClick={onClose}>
            Close
          </Button>
        </div>
        {user && <Player user={user} />}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

Profile.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Profile;
