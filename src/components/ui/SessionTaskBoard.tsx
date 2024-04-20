import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/SessionTaskBoard.scss";
import { api, handleError } from "helpers/api";

const SessionTaskBoard = ({
  teamId,
  teamTasks,
  sessionStatus,
  checkedTasks,
  setCheckedTasks,
}) => {
  if (!teamTasks) {
    return <p>No tasks currently in session!</p>;
  }

  const token = localStorage.getItem("token");

  const handleCheckboxChange = async (task) => {
    const newCheckedTasks = new Set(checkedTasks);
    if (newCheckedTasks.has(task.taskId)) {
      task.status = "IN_SESSION";
      newCheckedTasks.delete(task.taskId);
    } else {
      task.status = "IN_SESSION_DONE";
      newCheckedTasks.add(task.taskId);
    }

    try {
      const requestBody = JSON.stringify(task);
      await api.put(
        `/api/v1/teams/${teamId}/tasks/${task.taskId}`,
        requestBody,
        {
          headers: { Authorization: `${token}` },
        }
      );
      setCheckedTasks(newCheckedTasks);
    } catch (error) {
      console.error("Error moving Task:", handleError(error));
    }
  };

  React.useEffect(() => {
    const initialCheckedTasks = new Set(
      teamTasks
        .filter((task) => task.status === "IN_SESSION_DONE")
        .map((task) => task.taskId)
    );
    setCheckedTasks(initialCheckedTasks);
  }, [teamTasks, setCheckedTasks]);

  return (
    <div className="session-taskboard">
      <h3>Session Tasks</h3>
      <ul className="team-task-list">
        {teamTasks.map((task) => (
          <li key={task.taskId} style={{ listStyleType: "none" }}>
            <label style={{ display: "flex", alignItems: "flex-start" }}>
              <input
                type="checkbox"
                checked={checkedTasks.has(task.taskId)}
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
  checkedTasks: PropTypes.instanceOf(Set).isRequired,
  setCheckedTasks: PropTypes.func.isRequired,
};

export default SessionTaskBoard;
