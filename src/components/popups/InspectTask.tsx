import React, { useState } from "react";
import "../../styles/popups/CreateTeam.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";

const CreateTask = ({ isOpen, onClose, task }) => {
  const [editMode, setEditMode] = useState(false);
  if (!isOpen) return null;

  const ActivateEditMode = () => {
    setEditMode(true);
  };

  return (
    <div className="createTeam overlay" onClick={onClose}>
      <div className="createTeam content" onClick={(e) => e.stopPropagation()}>
        <Button className="red-button" onClick={onClose}>
          Close
        </Button>
        <h2>Create Task</h2>
        <h3>Task Title</h3>
        <input value={task.title} disabled={!editMode} />
        <h3>Task Description</h3>
        <input value={task.description} disabled={!editMode} />
        <div>
          {!editMode && (
            <Button className="green-button" onClick={ActivateEditMode}>
              Edit
            </Button>
          )}
          {editMode && <Button className="red-button">Delete</Button>}
          {editMode && <Button className="green-button">Save</Button>}
        </div>
      </div>
    </div>
  );
};

CreateTask.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
};

export default CreateTask;
