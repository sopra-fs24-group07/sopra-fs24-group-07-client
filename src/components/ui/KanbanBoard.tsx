import React, { useState } from "react";
import "../../styles/ui/KanbanBoard.scss";
import ColumnContainer from "./ColumnContainer";
import PropTypes from "prop-types";

function KanbanBoard(props) {
  const columns = ["TODO", "IN_SESSION", "DONE"];
  const { teamTasks } = props;

  return (
    <div className="board">
      <div className="cols">
        {columns.map((col) => (
          <ColumnContainer
            key={col}
            column={col}
            teamTasks={teamTasks}
          ></ColumnContainer>
        ))}
      </div>
      <div></div>
    </div>
  );
}

KanbanBoard.propTypes = {
  teamTasks: PropTypes.array,
};

export default KanbanBoard;
