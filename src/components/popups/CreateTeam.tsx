import React from "react";
import "../../styles/popups/ProfileMenu.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";

const CreateTeam = ({ isOpen, onClose, onCreateTeamClick }) => {
  if (!isOpen) return null;
  const navigate = useNavigate();

  const createTeam = () => {
    //team ID is received here from backend
    const teamid = "12";
    onCreateTeamClick(teamid);
  };

  return (
    <div className="profileMenu-overlay" onClick={onClose}>
      <div className="profileMenu-content" onClick={(e) => e.stopPropagation()}>
        <Button className="red-button" onClick={onClose}>
          Close
        </Button>
        <h2>Create Team</h2>
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
