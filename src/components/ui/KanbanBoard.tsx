import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/ui/KanbanBoard.scss";
import ColumnContainer from "./ColumnContainer";
import PropTypes from "prop-types";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { api, handleError } from "helpers/api";
import TaskCard from "./TaskCard";

function KanbanBoard(props) {
  const token = localStorage.getItem("token");
  const { teamId } = useParams();
  const columns = ["TODO", "IN_SESSION", "DONE"];
  const { teamTasks, sessionStatus } = props;

  const [activeTask, setActiveTask] = useState(null);
  const [isDragged, setIsDragged] = useState(null);

  function handleDragStart(event) {
    setActiveTask(event.active.data.current);
    setIsDragged(event.active.data.current.taskId);
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    setIsDragged(null);

    if (over && active.data.current.status !== over.id) {
      updateTaskStatus(active.data.current, over.id);
    }
  };

  const updateTaskStatus = async (task, newColumn) => {
    try {
      task.status = newColumn;
      const requestBody = JSON.stringify(task);
      const response = await api.put(
        `/api/v1/teams/${teamId}/tasks/${task.taskId}`,
        requestBody,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error moving Task:", handleError(error));
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="board">
        <div className="cols">
          {columns.map((col) => (
            <ColumnContainer
              key={col}
              column={col}
              teamTasks={teamTasks}
              sessionStatus={sessionStatus}
              isDragged={isDragged}
            ></ColumnContainer>
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeTask && (
          <TaskCard
            task={activeTask}
            col={activeTask.status}
            sessionStatus={sessionStatus}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}

KanbanBoard.propTypes = {
  teamTasks: PropTypes.array,
  sessionStatus: PropTypes.string,
};

export default KanbanBoard;
