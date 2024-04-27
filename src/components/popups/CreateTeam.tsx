import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import "../../styles/popups/CreateTeam.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Spinner } from "components/ui/Spinner";
import { FormField } from "../ui/FormField";
import { validateTeamForm } from "../utilities/ValidateForm";

const CreateTeam = ({ isOpen, onClose, onCreateTeamClick }) => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createTeam = async () => {
    setIsLoading(true);
    const isValid = validateTeamForm({
      teamName,
      teamDescription,
      setErrors,
      setIsLoading,
    });

    if (!isValid) return;

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
    } catch (error) {
      console.error("Error creating team:", handleError(error));
      setErrors((prev) => ({
        ...prev,
        general: "Failed to create team. Please try again.",
      }));
    }
    setIsLoading(false);
  };

  const getAllErrorMessages = () => {
    const fieldErrors = Object.values(errors).filter((error) => error);
    if (generalError) fieldErrors.push(generalError);

    return fieldErrors;
  };

  if (!isOpen) return null;

  return (
    <div className="createTeam overlay" onClick={onClose}>
      <div className="createTeam content" onClick={(e) => e.stopPropagation()}>
        <div className="createTeam header">
          <h2>Create Team</h2>
          <Button width="20%" className="red-button" onClick={onClose}>
            Close
          </Button>
        </div>
        <h3 className="createTeam headline">Name</h3>
        <FormField
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          error={errors.name}
        />
        <h3 className="createTeam headline">Description</h3>
        <FormField
          value={teamDescription}
          onChange={(e) => setTeamDescription(e.target.value)}
          error={errors.description}
          isDesc={true}
        />
        <Button width="100%" className="green-button" onClick={createTeam}>
          Create
        </Button>
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

CreateTeam.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateTeamClick: PropTypes.func.isRequired,
};

export default CreateTeam;
