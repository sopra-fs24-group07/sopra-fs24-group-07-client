import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/SessionTaskBoard.scss";

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

  const handleCheckboxChange = (task) => {
    const newCheckedTasks = new Set(checkedTasks);
    if (checkedTasks.has(task.taskId)) {
      newCheckedTasks.delete(task.taskId);
    } else {
      newCheckedTasks.add(task.taskId);
    }
    setCheckedTasks(newCheckedTasks);
  };

  console.log("checked", checkedTasks);
  return (
    <div className="session-taskboard">
      <h3>Session Tasks</h3>
      <div>
        <ul className="team-task-list">
          {teamTasks.map((task) => (
            <li key={task.taskId} style={{ listStyleType: "none" }}>
              <label style={{ display: "flex", alignItems: "flex-start" }}>
                <input
                  type="checkbox"
                  checked={checkedTasks.has(task.taskId)}
                  disabled={sessionStatus === "off"}
                  onChange={() => handleCheckboxChange(task)}
                  aria-disabled={sessionStatus === "off"}
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
