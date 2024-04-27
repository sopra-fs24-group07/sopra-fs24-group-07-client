import React, { useState, useEffect } from "react";
import "../../styles/popups/TeamSetting.scss";
import "../../styles/popups/InspectTask.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import { FormField } from "../ui/FormField";
import { Spinner } from "components/ui/Spinner";
import { validateTeamForm } from "../utilities/ValidateForm";
import ErrorMessages from "../utilities/ErrorMessages";

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
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

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
    setIsLoading(true);
    const isValid = validateTeamForm({
      teamName,
      teamDescription,
      setErrors,
      setIsLoading,
    });

    if (!isValid) return;
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
      setIsLoading(false);
      DeactivateEditMode();
    } catch (error) {
      setError("Something went wrong. Please try again");
      console.error("Error while updating Team", handleError(error));
    }
    setIsLoading(false);
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
    } catch (error) {
      setLeaveError("Failed to leave team");
      console.error("Failed to leave team:", handleError(error));
      if (error.response.status === 401) {
        setLeaveError("You are not authorized to leave the team, sorry!");
      } else if (error.response.status === 404) {
        setLeaveError("Something went wrong. Try again later");
      }
    }
  };

  const CopyInvitationLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteURL);
      setCopied("Copied to clipboard!");
    } catch (error) {
      setCopied("Failed to copy the UUID");
    }
  };

  const doClose = () => {
    setError("");
    setLeaveError("");
    setCopied("");
    DeactivateEditMode();
    onClose();
  };

  return (
    <div className="TeamSetting overlay" onClick={doClose}>
      <div className="TeamSetting content" onClick={(e) => e.stopPropagation()}>
        <div className="TeamSetting header">
          <h2>Team Settings</h2>
          {!editMode && (
            <Button className="green-button" onClick={ActivateEditMode}>
              Edit Team
            </Button>
          )}
          <Button className="red-button" onClick={doClose}>
            Close
          </Button>
        </div>
        {error && <p>{error}</p>}
        {!error && (
          <div>
            <h3 className="TeamSetting headline">Team Name</h3>
            <FormField
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Name..."
              disabled={!editMode}
              error={errors.name}
            />
            <h3 className="TeamSetting headline">Team Description</h3>
            <FormField
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              placeholder="Team Description..."
              disabled={!editMode}
              error={errors.description}
              isDesc={true}
            />
            {!editMode && (
              <div>
                <div>
                  <h3 className="TeamSetting headline">Team Members</h3>
                  <Button className="invite-user" onClick={CopyInvitationLink}>
                    Invite User
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
                <div>
                  <div className="TeamSetting footer">
                    <Button
                      className="green-button"
                      disabled={!teamName || !teamDescription}
                      onClick={editTeam}
                    >
                      Save Changes
                    </Button>
                    <Button className="red-button" onClick={DeactivateEditMode}>
                      Cancel
                    </Button>
                  </div>
                  <ErrorMessages errors={errors} generalError={generalError} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {isLoading ? <Spinner /> : ""}
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
