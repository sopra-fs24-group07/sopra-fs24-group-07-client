import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import "../../styles/popups/CreateTeam.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Spinner } from "components/ui/Spinner";

import { IoMdCloseCircle, IoMdCloseCircleOutline } from "react-icons/io";
import IconButton from "../ui/IconButton";
import FormField from "../ui/FormField";
import { PopupHeader } from "../ui/PopupHeader";

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

  if (!isOpen) return null;

  return (
    <div className="createTeam overlay" onClick={onClose}>
      <div className="createTeam content" onClick={(e) => e.stopPropagation()}>
        <PopupHeader onClose={onClose} title="Create Team" />
        <FormField
          value={teamName}
          onChange={setTeamName}
          error={errors.name}
          label={"Name"}
        />
        <FormField
          value={teamDescription}
          onChange={setTeamDescription}
          error={errors.description}
          label={"Description"}
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
