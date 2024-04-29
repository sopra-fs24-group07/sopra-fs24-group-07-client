import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import "../../styles/ui/KanbanBoard.scss";
import ColumnContainer from "./ColumnContainer";
import PropTypes from "prop-types";
import { DndContext } from "@dnd-kit/core";
import { api, handleError } from "helpers/api";

function KanbanBoard(props) {
  const token = localStorage.getItem("token");
  const { teamId } = useParams();

  //define the three columns we have
  const columns = ["TODO", "IN_SESSION", "DONE"];
  //get teams tasks from the props
  const { teamTasks, sessionStatus } = props;

  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log(active);
    console.log(over);

    if (active.data.current.status !== over.id) {
      updateTaskStatus(active.data.current, over.id);
    }
  };

  const updateTaskStatus = async (task, newColumn) => {
    //make api call to update status
    try {
      task.status = newColumn;
      const requestBody = JSON.stringify(task);
      console.log(requestBody);
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
    <DndContext onDragEnd={handleDragEnd}>
      <div className="board">
        <div className="cols">
          {/* map the the Columns and give tasks to ColumnContainer */}
          {columns.map((col) => (
            <ColumnContainer
              key={col}
              column={col}
              teamTasks={teamTasks}
              sessionStatus={sessionStatus}
            ></ColumnContainer>
          ))}
        </div>
      </div>
    </DndContext>
  );
}

//check teamTasks to be array
KanbanBoard.propTypes = {
  teamTasks: PropTypes.array,
  sessionStatus: PropTypes.string,
};

export default KanbanBoard;
