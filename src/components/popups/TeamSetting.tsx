import React, { useState, useEffect } from "react";
import "../../styles/popups/TeamSetting.scss";
import "../../styles/popups/InspectTask.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import EmailInput from "components/ui/EmailInput";
import { Spinner } from "components/ui/Spinner";

import {
  MdModeEditOutline,
  MdOutlineModeEdit,
  MdSave,
  MdOutlineSave,
  MdOutlineEditOff,
  MdEditOff,
  MdAutoFixNormal,
  MdAutoFixHigh,
  MdAutoFixOff,
} from "react-icons/md";
import IconButton from "../ui/IconButton";
import { useNotification } from "./NotificationContext";

import FormField from "../ui/FormField";
import { PopupHeader } from "../ui/PopupHeader";

const TeamSettings = ({ isOpen, onClose, onEdit, setIsLeave }) => {
  const [editMode, setEditMode] = useState(false);
  const [teamName, setTeamName] = useState();
  const [teamDescription, setTeamDescription] = useState();
  const [teamUUID, setTeamUUID] = useState();
  const [teamMembers, setTeamMembers] = useState([]);
  const [team, setTeam] = useState(null);
  const [inviteURL, setInviteURL] = useState();
  const [copied, setCopied] = useState("");
  const { teamId } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    email: "",
    form: "",
    leaveTeam: "",
  });
  const baseURL = window.location.origin;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { notify } = useNotification();
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const fetchUserTeam = async () => {
    try {
      const response = await api.get(`/api/v1/users/${userId}/teams`, {
        headers: { Authorization: `${token}` },
      });
      const foundTeam = response.data.find(
        (team) => team.teamId === parseInt(teamId)
      );
      setTeam(foundTeam);
      setTeamName(foundTeam.name);
      setTeamDescription(foundTeam.description);
      setTeamUUID(foundTeam.teamUUID);
      setInviteURL(`${baseURL}/invitation/${foundTeam.teamUUID}`);
    } catch (error) {
      setErrors({ ...errors, form: "Something went wrong. Please try again" });
      console.error("Something went wrong on:", handleError(error));
    }
  };

  useEffect(() => {
    fetchUserTeam();
  }, [editMode]);

  const validateForm = () => {
    let isValid = true;
    let newErrors = { ...errors, name: "", description: "" };

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
    } else if (teamDescription.length > 1000) {
      newErrors.description = "The description exceeds 1000 characters";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const editTeam = async () => {
    if (!validateForm()) {
      notify("error", "Some inputs are invalid!");
      console.log(errors.form);

      return;
    }
    try {
      const requestBody = JSON.stringify({
        name: teamName,
        description: teamDescription,
      });
      const response = await api.put(`/api/v1/teams/${teamId}`, requestBody, {
        headers: {
          Authorization: `${token}`,
        },
      });
      onEdit();
      DeactivateEditMode();
      notify("success", "Team updated successfully!");
    } catch (error) {
      setErrors({ ...errors, form: "Something went wrong. Please try again" });
      notify("error", "Failed to update team. Please try again.");
      console.error("Error while updating Team", handleError(error));
    }
  };

  if (!isOpen) return null;

  const ActivateEditMode = () => {
    setEditMode(true);
    setErrors({
      name: "",
      description: "",
      email: "",
      form: "",
      leaveTeam: "",
    });
  };

  const DeactivateEditMode = () => {
    setErrors({
      name: "",
      description: "",
      email: "",
      form: "",
      leaveTeam: "",
      genral: "",
    });
    setTeamDescription(team.description);
    setTeamName(team.name);
    setEditMode(false);
  };

  const LeaveTeam = async () => {
    try {
      const response = await api.delete(
        `/api/v1/teams/${teamId}/users/${userId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      document.dispatchEvent(new CustomEvent("leave-team"));
      setIsLeave(true);
      navigate("/teams");
      notify("success", "You have left the team successfully!");
    } catch (error) {
      setErrors({ ...errors, leaveTeam: "Failed to leave team" });
      notify("error", "Failed to leave team. Please try again.");
      console.error("Failed to leave team:", handleError(error));
      if (error.response.status === 401) {
        setErrors({
          ...errors,
          leaveTeam: "You are not authorized to leave the team, sorry!",
        });
      } else if (error.response.status === 404) {
        setErrors({
          ...errors,
          leaveTeam: "Something went wrong. Try again later.",
        });
      }
    }
  };

  const getAllErrorMessages = () => {
    const fieldErrors = Object.values(errors).filter((error) => error);
    if (generalError) fieldErrors.push(generalError);

    return fieldErrors;
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
      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 10000);
    } catch (error) {
      console.error("Error generating description:", handleError(error));
      notify("error", "Failed to generate description. Please try again.");
    }
    setIsLoading(false);
  };

  const doClose = () => {
    setErrors({
      name: "",
      description: "",
      email: "",
      form: "",
      leaveTeam: "",
      genral: "",
    });
    setCopied("");
    setEmail("");
    setGeneralError("");
    DeactivateEditMode();
    onClose();
  };

  return (
    <div className="TeamSetting overlay" onClick={doClose}>
      <div className="TeamSetting content" onClick={(e) => e.stopPropagation()}>
        <PopupHeader
          onClose={doClose}
          title={editMode ? "Edit Team" : "Your Team"}
        />
        {errors.form && <p className="error-message">{errors.form}</p>}
        <div>
          <FormField
            className="TeamSetting input"
            label={"Team Name"}
            value={teamName}
            onChange={setTeamName}
            placeholder="Team Name..."
            disabled={!editMode}
            error={errors.name}
          >
            {!editMode && (
              <IconButton
                hoverIcon={MdModeEditOutline}
                icon={MdOutlineModeEdit}
                onClick={ActivateEditMode}
                className="blue-icon"
                style={{
                  scale: "2",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
              />
            )}
            {editMode && (
              <IconButton
                hoverIcon={MdEditOff}
                icon={MdOutlineEditOff}
                onClick={DeactivateEditMode}
                className="red-icon"
                style={{
                  scale: "2",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
              />
            )}
          </FormField>
          <FormField
            className="TeamSetting input"
            label={"Team Description"}
            value={teamDescription}
            onChange={setTeamDescription}
            placeholder="Team Description..."
            disabled={!editMode}
            error={errors.description}
            textArea={true}
          >
            {editMode && (
              <IconButton
                hoverIcon={MdAutoFixHigh}
                icon={MdAutoFixNormal}
                onClick={generateAIDescription}
                className="yellow-icon"
                style={{
                  scale: "2",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
                disabled={isButtonDisabled}

              />
            )}
          </FormField>
          <div>
            {getAllErrorMessages().map((error, index) => (
              <div key={index} className="TeamSetting error">
                {error}
              </div>
            ))}
          </div>
          {!editMode && (
            <div>
              <Button onClick={LeaveTeam} className="leave-team">
                Leave Team
              </Button>
              {errors.leaveTeam && (
                <div className="error-message">{errors.leaveTeam}</div>
              )}
            </div>
          )}
          {editMode && (
            <div className="TeamSetting footer">
              <IconButton
                hoverIcon={MdSave}
                icon={MdOutlineSave}
                onClick={editTeam}
                className="green-icon"
                style={{
                  scale: "2.5",
                  marginLeft: "10px",
                }}
              />
            </div>
          )}
        </div>
      </div>
      {isLoading ? <Spinner /> : ""}
    </div>
  );
};

TeamSettings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  setIsLeave: PropTypes.func,
  isLeave: PropTypes.bool,
};

export default TeamSettings;
