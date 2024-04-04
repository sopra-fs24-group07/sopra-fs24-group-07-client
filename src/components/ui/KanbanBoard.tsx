import React, { useState } from "react";
import "../../styles/ui/KanbanBoard.scss";

function KanbanBoard() {
  const columns = ["TODO", "IN_SESSION", "DONE"];

  return (
    <div className="board">
      <div className="cols">
        {columns.map((col) => (
          <div className="col" key={col}>
            {col}
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;
