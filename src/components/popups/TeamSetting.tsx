import React, { useState, useEffect } from "react";
import "../../styles/popups/TeamSetting.scss";
import "../../styles/popups/InspectTask.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";

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

const FormField = (props) => {
  return (
    <div className="TeamSetting field">
      <input
        className="TeamSetting input"
        placeholder="enter here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={props.disabled}
      />
      {props.error && <p className="TeamSetting error">{props.error}</p>}
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
        disabled={props.disabled}
      />
      {props.error && <p className="TeamSetting error">{props.error}</p>}
    </div>
  );
};

FormField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

FormFieldLong.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

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
      newErrors.description = "The description is required";
      isValid = false;
    }

    if (teamDescription.length > 500) {
      newErrors.description = "The description exceeds 500 characters";
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
    if (!validateForm()) return;
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
    } catch (error) {
      setError("Something went wrong. Please try again");
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
            <IconButton
              hoverIcon={MdModeEditOutline}
              icon={MdOutlineModeEdit}
              onClick={ActivateEditMode}
              className="blue-icon"
              style={{ scale: "2.3", marginRight: "10px" }}
            />
          )}
          <IconButton
            hoverIcon={IoMdCloseCircle}
            icon={IoMdCloseCircleOutline}
            onClick={doClose}
            className="blue-icon"
            style={{ scale: "2.5", marginRight: "10px" }}
          />
        </div>
        {error && <p>{error}</p>}
        {!error && (
          <div>
            <h3 className="TeamSetting headline">Team Name</h3>
            <FormField
              className="TeamSetting input"
              value={teamName}
              onChange={setTeamName}
              placeholder="Team Name..."
              disabled={!editMode}
              error={errors.name}
            />
            <h3 className="TeamSetting headline">Team Description</h3>
            <FormFieldLong
              className="TeamSetting input"
              value={teamDescription}
              onChange={setTeamDescription}
              placeholder="Team Description..."
              disabled={!editMode}
              error={errors.description}
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
