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

const TeamMembers = ({ isOpen, onClose, onEdit, setIsLeave }) => {
  const [teamName, setTeamName] = useState();
  const [teamDescription, setTeamDescription] = useState();
  const [teamUUID, setTeamUUID] = useState();
  const [teamMembers, setTeamMembers] = useState([]);
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
      setErrors({ ...errors, form: "Something went wrong. Please try again" });
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
      setErrors({ ...errors, form: "Something went wrong. Please try again" });
      if (error.response.status === 401) {
        setErrors({
          ...errors,
          leaveTeam: "You are not authorized to do this",
        });
      }
      console.error(handleError(error));
    }
  };

  useEffect(() => {
    fetchUserTeam();
    fetchTeamMembers();
  }, []);

  if (!isOpen) return null;

  const CopyInvitationLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteURL);
      setCopied("Copied to clipboard!");
      setErrors({ ...errors, email: "" });
      notify("success", "Invitation link copied to clipboard!");
    } catch (error) {
      notify("error", "Failed to copy the correct invitation link!");
      setCopied("Failed to copy the UUID");
    }
  };

  const sendInvitationEmail = async () => {
    setErrors({ ...errors, email: "" });
    if (email.length === 0 || !email.includes("@")) {
      setErrors({ ...errors, email: "Please enter a valid email address." });

      return;
    }

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
      notify("success", "Invitation email sent successfully!");
      setErrors({
        name: "",
        description: "",
        email: "",
        form: "",
        leaveTeam: "",
      });
    } catch (error) {
      console.error("Failed to send email:", handleError(error));
      notify("error", "Failed to send email. Please try again.");
      if (!error.response) {
        setErrors({
          ...errors,
          email: "Failed to send email: No server response.",
        });
      } else if (error.response.status === 400) {
        setErrors({
          ...errors,
          email:
            "Invalid email format. Please check the email address and try again.",
        });
      } else if (error.response.status === 401) {
        setErrors({
          ...errors,
          email: "You are not authorized to send invitations for this team.",
        });
      } else if (error.response.status === 404) {
        setErrors({
          ...errors,
          email: "Team not found. Please check the team details and try again.",
        });
      } else if (error.response.status === 503) {
        setErrors({
          ...errors,
          email:
            "Unable to send email at this time. Mail service is unavailable or the email address is not available.",
        });
      } else {
        setErrors({
          ...errors,
          email: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  const getAllErrorMessages = () => {
    const fieldErrors = Object.values(errors).filter((error) => error);
    if (generalError) fieldErrors.push(generalError);

    return fieldErrors;
  };

  const doClose = () => {
    setErrors({
      name: "",
      description: "",
      email: "",
      form: "",
      leaveTeam: "",
    });
    setCopied("");
    setEmail("");
    setGeneralError("");
    onClose();
  };

  return (
    <div className="TeamSetting overlay" onClick={doClose}>
      <div className="TeamSetting content" onClick={(e) => e.stopPropagation()}>
        <PopupHeader onClose={doClose} title={"Your Team"} />
        {errors.form && <p className="error-message">{errors.form}</p>}
        <div>
          <div>
            {getAllErrorMessages().map((error, index) => (
              <div key={index} className="TeamSetting error">
                {error}
              </div>
            ))}
          </div>
          <div>
            <div className="TeamSetting members">
              <h3 className="TeamSetting headline">Invite Member</h3>
              <EmailInput
                label={"Email"}
                email={email}
                setEmail={setEmail}
                error={errors.email}
                setError={(emailError) =>
                  setErrors({ ...errors, email: emailError })
                }
              />
              <div className="button-container">
                <Button className="invite-user" onClick={sendInvitationEmail}>
                  Send as Email
                </Button>
                <Button className="invite-user" onClick={CopyInvitationLink}>
                  Copy Link
                </Button>
              </div>
              {copied && (
                <div>
                  <input className="TeamSetting input" value={inviteURL} />
                  <br />
                  <div className="TeamSetting copied">{copied}</div>
                </div>
              )}
            </div>
            <div className="TeamSetting members">
              <h3 className="TeamSetting headline">Team Members</h3>
              <ul className="TeamSetting list">
                {teamMembers.map((member) => (
                  <li className="TeamSetting listItem" key={member.id}>
                    {member.username} ({member.name})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? <Spinner /> : ""}
    </div>
  );
};

TeamMembers.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  setIsLeave: PropTypes.func,
  isLeave: PropTypes.bool,
};

export default TeamMembers;
