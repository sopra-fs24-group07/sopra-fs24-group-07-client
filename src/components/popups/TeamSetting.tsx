import React, { useState, useEffect } from "react";
import "../../styles/popups/TeamSetting.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";

const TeamSettings = ({ isOpen, onClose }) => {
  //const [editMode, setEditMode] = useState(false); EDIT Mode: for extensibility in M4
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
  const baseURL = window.location.origin;
  const navigate = useNavigate();

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
        setError("Something went wrong. Please try again");
        if (error.response.status === 401) {
          setLeaveError("You are not authorized to do this");
        }
        console.error(handleError(error));
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
        setError("Something went wrong. Please try again");
        if (error.response.status === 401) {
          setLeaveError("You are not authorized to do this");
        }
        console.error(handleError(error));
      }
    };

    fetchTeamMembers();
  }, []);

  if (!isOpen) return null;

  /* EDIT Mode: for extensibility in M4
  const ActivateEditMode = () => {
    setEditMode(true);
  };
  const DeactivateEditMode = () => {
    setEditMode(false);
  };
  */

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
      navigate("/teams");
    } catch (error) {
      setLeaveError("Failed to leave team");
      if (error.response.status === 401) {
        setLeaveError("You are not authorized to leave the team, sorry!");
      } else if (error.response.status === 404) {
        setLeaveError("You are not a member of this team anymore");
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
    //DeactivateEditMode(); EDIT Mode: for extensibility in M4
    onClose();
  };

  return (
    <div className="TeamSetting overlay" onClick={doClose}>
      <div className="TeamSetting content" onClick={(e) => e.stopPropagation()}>
        <Button className="red-button" onClick={doClose}>
          Close
        </Button>
        {error && <p>{error}</p>}
        {!error && (
          <div>
            <h2 className="TeamSetting headline">Team Settings</h2>
            <h3 className="TeamSetting headline">Team Name</h3>
            <input
              className="TeamSetting input"
              value={teamName}
              placeholder="Task Title..."
              disabled
            />
            <h3 className="TeamSetting headline">Team Description</h3>
            <input
              className="TeamSetting input"
              value={teamDescription}
              placeholder="Task Description..."
              disabled
            />
            <h3 className="TeamSetting headline">Team Members</h3>
            <ul className="TeamSetting list">
              {teamMembers.map((member) => (
                <li key={member.id}>
                  {member.username}, {member.name}
                </li>
              ))}
            </ul>
            {/*TODO: add onClick={LeaveTeam} when API is ready  */}
            <Button width="80%" className="leave-team">
              Leave Team
            </Button>
            {leaveError && (
              <div className="TeamSetting error">{leaveError}</div>
            )}
            <div>
              <Button
                width="80%"
                className="invite-user"
                onClick={CopyInvitationLink}
              >
                Invite User
              </Button>
              {copied && (
                <div>
                  <input className="TeamSetting input" value={inviteURL} />
                  <br />
                  <div className="TeamSetting error">{copied}</div>
                </div>
              )}
            </div>

            {/* EDIT Mode: for extensibility in M4: error && <p>{error}</p> */}

            {/* EDIT Mode: for extensibility in M4:
        <div>
          {!editMode && (
            <Button className="green-button" onClick={ActivateEditMode}>
              Edit
            </Button>
          )}
        </div>
        */}
          </div>
        )}
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
