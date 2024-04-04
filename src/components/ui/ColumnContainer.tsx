import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/ColumnContainer.scss";
import { Button } from "./Button";

function ColumnContainer(props) {
  const { column, teamTasks } = props;
  return (
    <div className="col">
      {column}
      <div className="tasksArea">
        {teamTasks.map((task) => {
          if (task.status === column)
            return <td key={task.id}>{task.title}</td>;
        })}
      </div>
      {column === "TODO" && <Button>Add Task</Button>}
    </div>
  );
}

ColumnContainer.propTypes = {
  column: PropTypes.string,
  teamTasks: PropTypes.array,
};

export default ColumnContainer;
