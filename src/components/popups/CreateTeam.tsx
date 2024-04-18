import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import "../../styles/popups/CreateTeam.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";

const FormField = ({ label, value, onChange, error }) => {
  return (
    <div className="createTeam field">
      <label className="createTeam label">{label}</label>
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

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

const CreateTeam = ({ isOpen, onClose, onCreateTeamClick }) => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [errors, setErrors] = useState({ name: "", description: "" });

  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: "", description: "" };

    if (!teamName) {
      newErrors.name = "Team name is required";
      isValid = false;
    } else if (teamName.length > 100) {
      newErrors.name = "The name exceeds 100 characters";
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

    return isValid;
  };

  const createTeam = async () => {
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
      navigate(`/teams/${response.data.teamId}`);
    } catch (error) {
      console.error("Error creating team:", handleError(error));
      setErrors((prev) => ({
        ...prev,
        general: "Failed to create team. Please try again.",
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="createTeam overlay" onClick={onClose}>
      <div className="createTeam content" onClick={(e) => e.stopPropagation()}>
        <Button className="red-button" onClick={onClose}>
          Close
        </Button>
        <h2>Create Team</h2>
        <FormField
          label="Name"
          value={teamName}
          onChange={setTeamName}
          error={errors.name}
        />
        <FormField
          label="Description"
          value={teamDescription}
          onChange={setTeamDescription}
          error={errors.description}
        />
        <Button className="green-button" onClick={createTeam}>
          Accept
        </Button>
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
      </div>
    </div>
  );
};

CreateTeam.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateTeamClick: PropTypes.func.isRequired,
};

export default CreateTeam;
