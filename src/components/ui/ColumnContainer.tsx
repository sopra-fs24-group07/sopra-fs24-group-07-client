import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import "../../styles/ui/ColumnContainer.scss";
import { Button } from "./Button";
import TaskCard from "./TaskCard";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function ColumnContainer(props) {
  const { column, teamTasks } = props;
  const [newTask, setNewTask] = useState(null);

  async function createTask(newTaskTitle) {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="col">
      <div>{column}</div>
      <div className="tasksArea">
        {teamTasks.map((task) => {
          if (task.status === column)
            return <TaskCard key={task.id} task={task} col={column}></TaskCard>;
        })}
      </div>
      {column === "TODO" && (
        <div className="createTask container">
          <input
            className="createTask input"
            placeholder={"Task Title..."}
            value={newTask}
            onChange={(nt) => setNewTask(nt.target.value)}
          />
          <Button
            className="createTask button"
            disabled={!newTask}
            onClick={() => createTask(newTask)}
          >
            Add Task
          </Button>
        </div>
      )}
    </div>
  );
}

ColumnContainer.propTypes = {
  column: PropTypes.string,
  teamTasks: PropTypes.array,
};

export default ColumnContainer;
