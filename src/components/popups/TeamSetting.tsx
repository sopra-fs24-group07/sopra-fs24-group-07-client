import React, { useState, useEffect } from "react";
import "../../styles/popups/TeamSetting.scss";
import "../../styles/popups/InspectTask.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import EmailInput from "components/ui/EmailInput";

import { IoMdCloseCircle, IoMdCloseCircleOutline } from "react-icons/io";
import {
  MdModeEditOutline,
  MdOutlineModeEdit,
  MdSave,
  MdOutlineSave,
  MdOutlineEditOff,
  MdEditOff,
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
  const [inviteURL, setInviteURL] = useState();
  const [copied, setCopied] = useState("");
  const { teamId } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  const [error, setError] = useState("");
  const [leaveError, setLeaveError] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });
  const baseURL = window.location.origin;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { notify } = useNotification();

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

    return isValid;
  };

  const fetchUserTeam = async () => {
    try {
      const response = await api.get(`/api/v1/users/${userId}/teams`, {
        headers: { Authorization: `${token}` },
      });
      const foundTeam = response.data.find(
        (team) => team.teamId === parseInt(teamId)
      );
      setTeamName(foundTeam.name);
      setTeamDescription(foundTeam.description);
      setTeamUUID(foundTeam.teamUUID);
      setInviteURL(`${baseURL}/invitation/${foundTeam.teamUUID}`);
    } catch (error) {
      setError("Something went wrong. Please try again");
      console.error("Something went wrong on:", handleError(error));
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get(`/api/v1/teams/${teamId}/users`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setTeamMembers(response.data);
    } catch (error) {
      setError("Something went wrong. Please try again");
      if (error.response.status === 401) {
        setLeaveError("You are not authorized to do this");
      }
      console.error(handleError(error));
    }
  };

  const editTeam = async () => {
    if (!validateForm()) {
      notify("error", "Some inputs are invalid!");
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
      setError("Something went wrong. Please try again");
      notify("error", "Failed to update team. Please try again.");
      console.error("Error while updating Team", handleError(error));
    }
  };

  useEffect(() => {
    fetchUserTeam();
    fetchTeamMembers();
  }, []);

  if (!isOpen) return null;

  const ActivateEditMode = () => {
    setEditMode(true);
  };
  const DeactivateEditMode = () => {
    setErrors({
      name: "",
      description: "",
    });
    fetchUserTeam();
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
      setLeaveError("Failed to leave team");
      notify("error", "Failed to leave team. Please try again.");
      console.error("Failed to leave team:", handleError(error));
      if (error.response.status === 401) {
        setLeaveError("You are not authorized to leave the team, sorry!");
      } else if (error.response.status === 404) {
        setLeaveError("Something went wrong. Try again later.");
      }
    }
  };

  const CopyInvitationLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteURL);
      setCopied("Copied to clipboard!");
      notify("success", "Invitation link copied to clipboard!");
    } catch (error) {
      notify("error", "Failed to copy the correct invitation link!");
      setCopied("Failed to copy the UUID");
    }
  };

  const sendInvitationEmail = async () => {
    setError("");
    const requestBody = {
      teamUUID: teamUUID,
      receiverEmail: email,
    };
    try {
      await api.post(
        `/api/v1/teams/${teamId}/invitations`,
        JSON.stringify(requestBody),
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setEmail("");
      setError(`The invitation has been sent to ${email} !`);
      notify("success", "Invitation email sent successfully!");
    } catch (error) {
      console.error("Failed to send email:", handleError(error));
      notify("error", "Failed to send email. Please try again.");
      if (!error.response) {
        setError("Failed to send email: No server response.");

        return;
      }
      if (error.response.status === 400) {
        setError(
          "Invalid email format. Please check the email address and try again."
        );
      } else if (error.response.status === 401) {
        setError("You are not authorized to send invitations for this team.");
      } else if (error.response.status === 404) {
        setError(
          "Team not found. Please check the team details and try again."
        );
      } else if (error.response.status === 503) {
        setError(
          "Unable to send email at this time. Mail service is unavailable or the email address is not available."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const doClose = () => {
    setError("");
    setLeaveError("");
    setCopied("");
    DeactivateEditMode();
    setEmail("");
    onClose();
  };

  return (
    <div className="TeamSetting overlay" onClick={doClose}>
      <div className="TeamSetting content" onClick={(e) => e.stopPropagation()}>
        <PopupHeader
          onClose={onClose}
          title={editMode ? "Edit Team" : "Your Team"}
        />
        {error && <p>{error}</p>}
        {!error && (
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
                  className="green-icon"
                  style={{ scale: "2.3", marginRight: "10px" }}
                />
              )}
              {editMode && (
                <IconButton
                  hoverIcon={MdEditOff}
                  icon={MdOutlineEditOff}
                  onClick={DeactivateEditMode}
                  className="red-icon"
                  style={{
                    scale: "2.3",
                    marginRight: "10px",
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
            />
            {!editMode && (
              <div>
                <div>
                  <h3 className="TeamSetting headline">Team Members</h3>
                  <EmailInput
                    email={email}
                    setEmail={setEmail}
                    error={error}
                    setError={setError}
                  />
                  <Button className="invite-user" onClick={sendInvitationEmail}>
                    Send Invitation Email
                  </Button>
                  <Button className="invite-user" onClick={CopyInvitationLink}>
                    Copy Invite Link
                  </Button>
                  {copied && (
                    <div>
                      <input className="TeamSetting input" value={inviteURL} />
                      <br />
                      <div className="TeamSetting copied">{copied}</div>
                    </div>
                  )}
                  <ul className="TeamSetting list">
                    {teamMembers.map((member) => (
                      <li className="TeamSetting listItem" key={member.id}>
                        {member.username} ({member.name})
                      </li>
                    ))}
                  </ul>
                </div>
                <Button onClick={LeaveTeam} className="leave-team">
                  Leave Team
                </Button>
                {leaveError && (
                  <div className="TeamSetting error">{leaveError}</div>
                )}
              </div>
            )}
            <p>{error}</p>
            <div>
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
        )}
      </div>
    </div>
  );
};

TeamSettings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  setIsLeave: PropTypes.func,
  isLeave: PropTypes.boolean,
};

export default TeamSettings;
