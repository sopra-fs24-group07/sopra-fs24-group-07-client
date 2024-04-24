import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/SessionTaskBoard.scss";
import { api, handleError } from "helpers/api";

const SessionTaskBoard = ({ teamId, teamTasks, sessionStatus }) => {
  if (!teamTasks) {
    return <p>No tasks currently in session!</p>;
  }

  const token = localStorage.getItem("token");

  const handleCheckboxChange = async (task) => {
    // Toggle task status based on current status
    task.status =
      task.status === "IN_SESSION" ? "IN_SESSION_DONE" : "IN_SESSION";

    try {
      const requestBody = JSON.stringify(task);
      await api.put(
        `/api/v1/teams/${teamId}/tasks/${task.taskId}`,
        requestBody,
        {
          headers: { Authorization: `${token}` },
        }
      );
    } catch (error) {
      console.error("Error updating Task:", handleError(error));
    }
  };

  return (
    <div className="session-taskboard">
      <h3>Session Tasks</h3>
      <ul className="team-task-list">
        {teamTasks.map((task) => (
          <li key={task.taskId} style={{ listStyleType: "none" }}>
            <label style={{ display: "flex", alignItems: "flex-start" }}>
              <input
                type="checkbox"
                checked={task.status === "IN_SESSION_DONE"}
                disabled={sessionStatus === "off"}
                onChange={() => handleCheckboxChange(task)}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "5px",
                }}
              >
                <strong>{task.title}</strong>
                <span>{task.description}</span>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

SessionTaskBoard.propTypes = {
  teamTasks: PropTypes.arrayOf(
    PropTypes.shape({
      taskId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  sessionStatus: PropTypes.string,
  teamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default SessionTaskBoard;
