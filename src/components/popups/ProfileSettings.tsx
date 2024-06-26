import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import "../../styles/popups/ProfileMenu.scss";
import { useNavigate } from "react-router-dom";
import ConfirmDelete from "./ConfirmDelete";
import { Spinner } from "components/ui/Spinner";
import { useNotification } from "./NotificationContext";

import { IoMdCloseCircle, IoMdCloseCircleOutline } from "react-icons/io";
import {
  MdModeEditOutline,
  MdOutlineModeEdit,
  MdSave,
  MdOutlineSave,
  MdDeleteOutline,
  MdDelete,
  MdOutlineEditOff,
  MdEditOff,
} from "react-icons/md";
import IconButton from "../ui/IconButton";
import FormField from "../ui/FormField";
import { PopupHeader } from "../ui/PopupHeader";

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
  const { notify } = useNotification();

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

  const validateForm = () => {
    let isValid = true;
    let errors = { username: "", name: "", password: "", repPassword: "" };

    if (!username) {
      errors.username = "Username is required";
      isValid = false;
    }

    if (username.length > 30) {
      errors.username = "Username exceeds the 30 character limit!";
      isValid = false;
    }

    if (!name) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (name.length > 50) {
      errors.name = "Name exceeds the 50 character limit!";
      isValid = false;
    }

    if (repPassword !== password) {
      errors.password = "The passwords do not match";
      isValid = false;
    }

    if (!password || password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    if (password.length > 50) {
      errors.password = "Password exceeds the 50 character limit";
      isValid = false;
    }

    setErrors(errors);
    setTimeout(() => {}, 500);

    return isValid;
  };

  const saveChanges = async () => {
    if (!validateForm()) return;
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
        setUser(updatedUser);
        setUsername(updatedUser.username);
        setName(updatedUser.name);
        setPassword("");
        setRepPassword("");
        onProfileOpen(true);
      } catch (error) {
        let errorMessage = "";
        if (error.response.status === 400) {
          errorMessage = "Invalid Input. Please try again";
        } else if (error.response.status === 401) {
          errorMessage = "You are not authorized to edit this user";
        } else if (error.response.status === 404) {
          errorMessage = "The requested user was not found";
        } else if (error.response.status === 409) {
          errorMessage =
            "Username already taken. Please choose a different username";
        } else {
          errorMessage =
            "Unexpected error. Please try again or contact an admin";
        }
        setError(errorMessage);
        console.error("Failed to save changes:", error);
      }
    }
    setIsLoading(false);
  };

  const handleDeleteAccount = () => {
    setShowConfirmationPopup(true);
  };

  const closeProfileSettings = () => {
    setShowConfirmationPopup(false);
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
      document.dispatchEvent(new CustomEvent("delete-user"));
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
        <PopupHeader onClose={onClose} title="Edit Profile"></PopupHeader>
        {!showConfirmationPopup && (
          <div>
            <FormField label="Username" value={username} onChange={setUsername}>
              <IconButton
                hoverIcon={MdEditOff}
                icon={MdOutlineEditOff}
                onClick={openProfileOnClose}
                title={"Quit Editing"}
                className="red-icon"
                style={{
                  scale: "1.8",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
              />
            </FormField>
            <FormField label="Name" value={name} onChange={setName} />
            <FormField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
            />
            <FormField
              label="Repeat Password"
              type="password"
              value={repPassword}
              onChange={setRepPassword}
            />
            {error && <div className="register error">{error}</div>}
            {getAllErrorMessages().map((error, index) => (
              <div key={index} className="register error">
                {error}
              </div>
            ))}
            <div className="profileMenu-header">
              <IconButton
                hoverIcon={MdSave}
                icon={MdOutlineSave}
                onClick={saveChanges}
                title={"Save Changes"}
                className="green-icon"
                style={{ scale: "2", marginLeft: "10px" }}
              />
              <IconButton
                hoverIcon={MdDelete}
                icon={MdDeleteOutline}
                onClick={handleDeleteAccount}
                title={"Delete Account"}
                className="red-icon"
                style={{ scale: "2", marginRight: "10px" }}
              />
            </div>
          </div>
        )}
        {showConfirmationPopup && (
          <ConfirmDelete
            onCancel={() => setShowConfirmationPopup(false)}
            onConfirm={confirmDeleteAccount}
          />
        )}
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
