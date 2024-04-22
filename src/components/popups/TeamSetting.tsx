import React, { useState, useEffect } from "react";
import "../../styles/popups/TeamSetting.scss";
import "../../styles/popups/InspectTask.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";

const FormField = (props) => {
  return (
    <div className="TeamSetting field">
      <input
        className="TeamSetting input"
        placeholder="enter here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={true}
      />
    </div>
  );
};

const FormFieldLong = (props) => {
  return (
    <div className="TeamSetting field">
      <textarea
        className="TeamSetting textarea"
        placeholder="enter here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={true}
      />
    </div>
  );
};

FormField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

FormFieldLong.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

const TeamSettings = ({ isOpen, onClose, setIsLeave }) => {
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
        /*
        if (error.response.status === 401) {
          setLeaveError("You are not authorized to do this");
        }
        console.error(handleError(error));

         */
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

    fetchUserTeam();
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
    //DeactivateEditMode(); EDIT Mode: for extensibility in M4
    onClose();
  };

  return (
    <div className="TeamSetting overlay" onClick={doClose}>
      <div className="TeamSetting content" onClick={(e) => e.stopPropagation()}>
        <div className="TeamSetting header">
          <h2 className="TeamSetting headline">Team Settings</h2>
          <Button className="red-button" onClick={doClose}>
            Close
          </Button>
        </div>
        {error && <p>{error}</p>}
        {!error && (
          <div>
            <h3 className="TeamSetting headline">Team Name</h3>
            <FormField
              className="TeamSetting input"
              value={teamName}
              placeholder="Team Name..."
              disabled
            />
            <h3 className="TeamSetting headline">Team Description</h3>
            <FormFieldLong
              className="TeamSetting input"
              value={teamDescription}
              placeholder="Team Description..."
              disabled
            />
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
            <div></div>
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
  setIsLeave: PropTypes.func,
};

export default TeamSettings;
