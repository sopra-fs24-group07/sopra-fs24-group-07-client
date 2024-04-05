import React, { useState } from "react";
import "../../styles/popups/CreateTeam.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";

const FormField = (props) => {
  return (
    <div className="createTeam field">
      <label className="createTeam label">{props.label}</label>
      <input
        className="createTeam input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
};

const CreateTeam = ({ isOpen, onClose, onCreateTeamClick }) => {
  if (!isOpen) return null;
  const [teamName, setTeamName] = useState<string>(null);

  const createTeam = () => {
    //todo: implement API call; team ID is received here from backend API API API
    const teamid = "16";
    onCreateTeamClick(teamid);
  };

  return (
    <div className="createTeam overlay" onClick={onClose}>
      <div className="createTeam content" onClick={(e) => e.stopPropagation()}>
        <Button className="red-button" onClick={onClose}>
          Close
        </Button>
        <h2>Create Team</h2>
        <FormField
          label="Name"
          value={teamName}
          onChange={(tn: string) => setTeamName(tn)}
        />
        <Button className="green-button" onClick={createTeam}>
          Accept
        </Button>
      </div>
    </div>
  );
};

CreateTeam.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateTeamClick: PropTypes.func.isRequired,
};

export default CreateTeam;
