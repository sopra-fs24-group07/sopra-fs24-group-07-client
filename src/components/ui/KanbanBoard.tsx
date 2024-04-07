import React, { useState, useMemo } from "react";
import "../../styles/ui/KanbanBoard.scss";
import ColumnContainer from "./ColumnContainer";
import PropTypes from "prop-types";
import { DndContext } from "@dnd-kit/core";

function KanbanBoard(props) {
  //define the three columns we have
  const columns = ["TODO", "IN_SESSION", "DONE"];
  //get teams tasks from the props
  const { teamTasks } = props;

  return (
    <div className="board">
      <div className="cols">
        {/* map the the Columns and give tasks to ColumnContainer */}
        {columns.map((col) => (
          <ColumnContainer
            key={col}
            column={col}
            teamTasks={teamTasks}
          ></ColumnContainer>
        ))}
      </div>
    </div>
  );
}

//check teamTasks to be array
KanbanBoard.propTypes = {
  teamTasks: PropTypes.array,
};

export default KanbanBoard;
