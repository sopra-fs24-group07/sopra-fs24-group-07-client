import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import "../../styles/popups/CreateTeam.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Spinner } from "components/ui/Spinner";

import { IoMdCloseCircle, IoMdCloseCircleOutline } from "react-icons/io";
import IconButton from "../ui/IconButton";
import { MdAutoFixHigh, MdAutoFixNormal } from "react-icons/md";

const FormField = ({ value, onChange, error }) => {
  return (
    <div className="createTeam field">
      <input
        className="createTeam input"
        type="text"
        placeholder="enter here.."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

const FormFieldLong = ({ value, onChange, error }) => {
  return (
    <div className="createTeam field">
      <textarea
        className="createTeam textarea"
        type="text"
        placeholder="enter here.."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

FormField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

FormFieldLong.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

const CreateTeam = ({ isOpen, onClose, onCreateTeamClick }) => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: "", description: "" };

    if (!teamName) {
      newErrors.name = "Team name is required";
      isValid = false;
    } else if (teamName.length > 50) {
      newErrors.name = "The name exceeds 50 characters";
      isValid = false;
    }

    if (!teamDescription) {
      newErrors.description = "The description is required"; //Since edit is not available
      isValid = false;
    }

    if (teamDescription.length > 500) {
      newErrors.description = "The description exceeds 500 characters";
      isValid = false;
    }

    setErrors(newErrors);
    setIsLoading(false);

    return isValid;
  };

  const createTeam = async () => {
    setIsLoading(true);
    if (!validateForm()) return;

    try {
      let token = localStorage.getItem("token");
      const requestBody = JSON.stringify({
        name: teamName,
        description: teamDescription,
      });

      const response = await api.post("/api/v1/teams", requestBody, {
        headers: {
          Authorization: `${token}`,
        },
      });

      onCreateTeamClick(response.data.teamId);
      setTimeout(() => {
        setIsLoading(false); // Set loading to false after the delay and navigation
      }, 500);
      //navigate(`/teams/${response.data.teamId}`);
    } catch (error) {
      console.error("Error creating team:", handleError(error));
      setErrors((prev) => ({
        ...prev,
        general: "Failed to create team. Please try again.",
      }));
    }
    setIsLoading(false);
  };

  const generateAIDescription = async () => {
    setIsLoading(true);
    if (!teamName) {
      let newErrors = { name: "" };
      console.log("No teamname was given", teamName);
      newErrors.name = "Team name is required";
      setErrors(newErrors);
      setIsLoading(false);

      return;
    };
    try {
      let token = localStorage.getItem("token");
      const requestBody = JSON.stringify({
        prompt: teamName
      });
      const response = await api.post("/api/v1/ai/gpt-3.5-turbo-instruct", teamName, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      setTeamDescription(response.data);
    } catch (error) {
      console.error("Error generating description:", handleError(error));
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  const setOnClose = () => {
    setTeamName("");
    setTeamDescription("");
    setErrors({ name: "", description: "", general: "" });
    onClose();
  }

  return (
    <div className="createTeam overlay" onClick={setOnClose}>
      <div className="createTeam content" onClick={(e) => e.stopPropagation()}>
        <div className="createTeam header">
          <h2>Create Team</h2>
          <IconButton
            hoverIcon={IoMdCloseCircle}
            icon={IoMdCloseCircleOutline}
            onClick={setOnClose}
            className="red-icon"
            style={{ scale: "2.5", marginTop: "-5px" }}
          />
        </div>
        <h3 className="createTeam headline">Name</h3>
        <FormField
          value={teamName}
          onChange={setTeamName}
          error={errors.name}
        />
        <h3 className="createTeam headline">Description</h3>
        <FormFieldLong
          value={teamDescription}
          onChange={setTeamDescription}
          error={errors.description}
        />
        <IconButton
          hoverIcon={MdAutoFixHigh}
          icon={MdAutoFixNormal}
          onClick={generateAIDescription}
          className="yellow-icon"
          style={{
            scale: "2.3",
            marginRight: "10px",
            margin: "1em",
            alignSelf: "flex-end",
          }}
        />
        <Button
          width="100%"
          className="green-button createTeam cButton"
          onClick={createTeam}
        >
          Create
        </Button>
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
      </div>
      {isLoading ? <Spinner /> : ""}
    </div>
  );
};

CreateTeam.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateTeamClick: PropTypes.func.isRequired,
};

export default CreateTeam;
