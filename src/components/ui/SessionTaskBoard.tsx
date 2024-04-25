import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/ui/SessionTaskBoard.scss";
import { api, handleError } from "helpers/api";
import { Link } from "react-router-dom";
import InspectTask from "components/popups/InspectTask";

const SessionTaskBoard = ({ teamId, teamTasks, sessionStatus }) => {
  if (!teamTasks) {
    return <p>No tasks currently in session!</p>;
  }
  const token = localStorage.getItem("token");
  const [isInspectTaskOpen, setInspectTaskOpen] = useState(false);
  const [inspectTask, setInspectTask] = useState(null);
  let inTaskasd;

  //open the Inspect Task Popup
  const openInspectTask = (task) => {
    inTaskasd = task;
    setInspectTaskOpen(true);
  };

  //close the Inspect Task Popup
  const closeInspectTask = () => {
    setInspectTaskOpen(false);
  };

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
          <>
            <li
              key={task.taskId}
              style={{ listStyleType: "none", display: "flex" }}
            >
              <input
                type="checkbox"
                checked={task.status === "IN_SESSION_DONE"}
                disabled={sessionStatus === "off"}
                onChange={() => handleCheckboxChange(task)}
                style={{ pointerEvents: "auto", cursor: "pointer" }}
              />
              <div
                style={{
                  marginLeft: "5px",
                }}
              >
                <Link
                  onClick={() => openInspectTask(task)}
                  style={{ textDecoration: "none" }}
                >
                  {task.title}
                </Link>
              </div>
            </li>
          </>
        ))}
      </ul>
      {inspectTask && (
        <InspectTask
          isOpen={isInspectTaskOpen}
          onClose={closeInspectTask}
          task={inTaskasd}
          inSession={true}
        />
      )}
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
