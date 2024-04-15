import React, { useState, useEffect } from "react";
import "../../styles/popups/TeamSetting.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";

const TeamSettings = ({ isOpen, onClose }) => {
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
  const baseURL = window.location.origin;

  useEffect(() => {
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
        console.error("Error fetching user teams:", error);
      }
    };

    fetchUserTeam();

    const fetchTeamMembers = async () => {
      try {
        const response = await api.get(`/api/v1/teams/${teamId}/users`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setTeamMembers(response.data);
      } catch (error) {
        console.error(`Error fetching teams users: ${handleError(error)}`);
      }
    };

    fetchTeamMembers();
  }, []);

  if (!isOpen) return null;

  const ActivateEditMode = () => {
    setEditMode(true);
  };
  const DeactivateEditMode = () => {
    setEditMode(false);
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
    setCopied("");
    DeactivateEditMode();
    onClose();
  };

  return (
    <div className="TeamSetting overlay" onClick={doClose}>
      <div className="TeamSetting content" onClick={(e) => e.stopPropagation()}>
        <Button className="red-button" onClick={doClose}>
          Close
        </Button>
        <h2 className="TeamSetting headline">Team Settings of</h2>
        <input
          className="TeamSetting input"
          value={teamName}
          placeholder="Task Title..."
          disabled={!editMode}
        />
        <h3 className="TeamSetting headline">Team Description</h3>
        <input
          className="TeamSetting input"
          value={teamDescription}
          placeholder="Task Description..."
          disabled={!editMode}
        />
        <h3 className="TeamSetting headline">Team Members</h3>
        <ul className="TeamSetting list">
          {teamMembers.map((member) => (
            <li key={member.id}>{member.username}</li>
          ))}
        </ul>
        <div>
          <Button onClick={CopyInvitationLink}>Invite User</Button>
          {copied && (
            <div>
              <input value={inviteURL} />
              <br />
              {copied}
            </div>
          )}
        </div>

        {error && <p>{error}</p>}

        <div>
          {!editMode && (
            <Button className="green-button" onClick={ActivateEditMode}>
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

TeamSettings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
};

export default TeamSettings;
