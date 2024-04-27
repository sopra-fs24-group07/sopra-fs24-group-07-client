import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import "../../styles/popups/ProfileMenu.scss";
import { useNavigate } from "react-router-dom";
import ConfirmDelete from "./ConfirmDelete";
import { Spinner } from "components/ui/Spinner";
import { FormField } from "../ui/FormField";
import { validateRegistrationForm } from "../utilities/ValidateForm";

const ProfileSettings = ({ isOpen, onClose, onProfileOpen }) => {
  const [user, setUser] = useState({ id: "", username: "", name: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repPassword, setRepPassword] = useState<string>("");
  const [errors, setErrors] = useState({
    username: "",
    name: "",
    password: "",
    repPassword: "",
  });
  const [generalError, setGeneralError] = useState("");
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

        const fetchedUser = {
          id: response.data.userId,
          username: response.data.username,
          name: response.data.name,
        };

        setUser(fetchedUser);
        setUsername(fetchedUser.username);
        setName(fetchedUser.name);
        setError("");
        setPassword("");
        setRepPassword("");
        setErrors({ username: "", name: "", password: "", repPassword: "" });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to fetch user data");
      }
    }

    fetchUser();
  }, [isOpen]);

  if (!isOpen) return null;

  const saveChanges = async () => {
    setIsLoading(true);
    const isValid = validateRegistrationForm({
      username,
      name,
      password,
      repPassword,
      setErrors,
      setIsLoading,
    });

    if (!isValid) return;
    setIsLoading(true);
    let updatedUser = { ...user, username, name, password };
    let token = localStorage.getItem("token");
    let userId = localStorage.getItem("id");
    const requestbody = JSON.stringify(updatedUser);

    if (username !== user.username || name !== user.name || password) {
      try {
        const response = await api.put(`/api/v1/users/${userId}`, requestbody, {
          headers: {
            Authorization: `${token}`,
          },
        });

        console.log("Saving changes:", response);
        setUser(updatedUser);
        setUsername(updatedUser.username);
        setName(updatedUser.name);
        setPassword("");
        setRepPassword("");
        onProfileOpen(true);
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message
          : `An unknown error occurred! Contact an administrator: ${error}`;
        setGeneralError(errorMessage);
        console.error("Something went wrong during the registration:", error);
      }
    }
    setIsLoading(false);
  };

  const handleDeleteAccount = () => {
    setShowConfirmationPopup(true);
  };

  const closeProfileSettings = () => {
    setShowConfirmationPopup(false);
    setGeneralError("");
    onClose();
  };

  const openProfileOnClose = () => {
    onProfileOpen(false);
  };

  const confirmDeleteAccount = async () => {
    let token = localStorage.getItem("token");
    let userId = localStorage.getItem("id");
    try {
      await api.delete(`/api/v1/users/${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      localStorage.clear();
      navigate("/start");
    } catch (error) {
      setError("Error deleting user account.");
      console.error("Error deleting user account:", error);
    }
    setShowConfirmationPopup(false); // Close the confirmation popup
  };

  const getAllErrorMessages = () => {
    const fieldErrors = Object.values(errors).filter((error) => error);
    if (generalError) fieldErrors.push(generalError);

    return fieldErrors;
  };

  return (
    <div className="profileMenu-overlay" onClick={closeProfileSettings}>
      <div className="profileMenu-content" onClick={(e) => e.stopPropagation()}>
        <div className="profileMenu-header">
          <h2>Settings</h2>
          <Button className="red-button" onClick={closeProfileSettings}>
            Close
          </Button>
        </div>
        {!showConfirmationPopup && (
          <div>
            <FormField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FormField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormField
              label="Repeat Password"
              type="password"
              value={repPassword}
              onChange={(e) => setRepPassword(e.target.value)}
            />
            <Button className="green-button" onClick={saveChanges}>
              Save
            </Button>
            <Button className="red-button" onClick={openProfileOnClose}>
              Cancel
            </Button>
            <Button className="red-button" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        )}
        {showConfirmationPopup && (
          <ConfirmDelete
            onCancel={() => setShowConfirmationPopup(false)}
            onConfirm={confirmDeleteAccount}
          />
        )}
        {error && <div className="error-message">{error}</div>}
        {getAllErrorMessages().map((error, index) => (
          <div key={index} className="error-message">
            {error}
          </div>
        ))}
      </div>
      {isLoading ? <Spinner /> : ""}
    </div>
  );
};

ProfileSettings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProfileOpen: PropTypes.func,
};

export default ProfileSettings;
