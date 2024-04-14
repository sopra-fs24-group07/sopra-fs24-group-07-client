import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import "../../styles/popups/ProfileMenu.scss";

const FormField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) => (
  <div className="editProfile field">
    <label className="editProfile label">{label}</label>
    <input
      className="editProfile input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

const ProfileSettings = ({ isOpen, onClose }) => {
  const [user, setUser] = useState({ id: "", username: "", name: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (!isOpen) return;

      let token = sessionStorage.getItem("token");
      let userId = sessionStorage.getItem("id"); // todo might need to change this depending on out implementation of our token to userId methods

      /*
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
      */

      setUser({
        id: userId,
        username: "TestUsername",
        name: "TestName",
      });
    }

    fetchUser();
  }, [isOpen]);

  const handleChange = (field) => (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: e.target.value,
    }));
  };

  const saveChanges = async () => {
    // todo implement API call to edit user information
    console.log("Saving changes:", user);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="profileMenu-overlay" onClick={onClose}>
      <div className="profileMenu-content" onClick={(e) => e.stopPropagation()}>
        <div className="profileMenu-header">
          <h2>Settings</h2>
          <Button className="red-button" onClick={saveChanges}>
            Close
          </Button>
        </div>
        <FormField
          label="Username"
          value={user.username}
          onChange={handleChange("username")}
        />
        <FormField
          label="Name"
          value={user.name}
          onChange={handleChange("name")}
        />
        <Button className="green-button" disabled onClick={saveChanges}>
          Save
        </Button>
        <Button className="red-button" disabled onClick={saveChanges}>
          Cancel
        </Button>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

ProfileSettings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProfileSettings;
