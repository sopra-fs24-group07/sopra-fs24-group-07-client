import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import "../../styles/popups/CreateTeam.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Spinner } from "components/ui/Spinner";
import { useNotification } from "./NotificationContext";

import IconButton from "../ui/IconButton";

import FormField from "../ui/FormField";
import { PopupHeader } from "../ui/PopupHeader";

import { MdAutoFixHigh, MdAutoFixNormal } from "react-icons/md";

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
  const { notify } = useNotification();
  const [generalError, setGeneralError] = useState("");

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
      newErrors.description = "The description is required";
      isValid = false;
    }

    if (teamDescription.length > 1000) {
      newErrors.description = "The description exceeds 1000 characters";
      isValid = false;
    }

    setErrors(newErrors);
    setIsLoading(false);

    return isValid;
  };

  const createTeam = async () => {
    setIsLoading(true);
    if (!validateForm()) {
      notify("error", "Some inputs are invalid!");

      return;
    }

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
      notify("success", "Team created successfully!");
      //navigate(`/teams/${response.data.teamId}`);
    } catch (error) {
      console.error("Error creating team:", handleError(error));
      notify("error", "Failed to create team. Please try again.");
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
    }
    try {
      let token = localStorage.getItem("token");
      const requestBody = JSON.stringify({
        promptParameter: teamName,
      });
      const response = await api.post(
        "/api/v1/ai/gpt-3.5-turbo-instruct",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      setTeamDescription(response.data.answer);
    } catch (error) {
      console.error("Error generating description:", handleError(error));
      notify("error", "Failed to generate description. Please try again.");
      setErrors((prev) => ({
        ...prev,
        general: "Failed to create team. Please try again.",
      }));
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  const setOnClose = () => {
    setTeamName("");
    setTeamDescription("");
    setErrors({ name: "", description: "", general: "" });
    onClose();
  };

  const getAllErrorMessages = () => {
    const fieldErrors = Object.values(errors).filter((error) => error);
    if (generalError) fieldErrors.push(generalError);

    return fieldErrors;
  };

  return (
    <div className="createTeam overlay" onClick={setOnClose}>
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
          textArea={true}
        >
          <IconButton
            hoverIcon={MdAutoFixHigh}
            icon={MdAutoFixNormal}
            onClick={generateAIDescription}
            className="yellow-icon"
            style={{
              scale: "2",
              marginRight: "10px",
              margin: "1em",
              alignSelf: "flex-end",
            }}
          />
        </FormField>
        {getAllErrorMessages().map((error, index) => (
          <div key={index} className="createTeam error">
            {error}
          </div>
        ))}
        <Button
          width="100%"
          className="green-button createTeam cButton"
          onClick={createTeam}
        >
          Create
        </Button>
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
