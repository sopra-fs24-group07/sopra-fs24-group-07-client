import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import "../../styles/ui/ColumnContainer.scss";
import { Button } from "./Button";
import TaskCard from "./TaskCard";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import CreateTask from "../popups/CreateTask";

function ColumnContainer(props) {
  const { column, teamTasks } = props;
  const [newTask, setNewTask] = useState(null);
  const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);

  const openCreateTask = () => {
    setCreateTaskOpen(true);
  };

  const closeCreateTask = () => {
    setCreateTaskOpen(false);
  };

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
          <Button
            width="100%"
            className="createTask button"
            onClick={openCreateTask}
          >
            Add Task
          </Button>
          <CreateTask isOpen={isCreateTaskOpen} onClose={closeCreateTask} />
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
