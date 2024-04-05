import React, { useMemo } from "react";
import PropTypes from "prop-types";
import "../../styles/ui/ColumnContainer.scss";
import { Button } from "./Button";
import TaskCard from "./TaskCard";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function ColumnContainer(props) {
  const { column, teamTasks } = props;

  return (
    <div className="col">
      <div>{column}</div>
      <div className="tasksArea">
        {teamTasks.map((task) => {
          if (task.status === column)
            return <TaskCard key={task.id} task={task} col={column}></TaskCard>;
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
