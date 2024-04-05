import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/TaskCard.scss";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "./Button";

function TaskCard(props) {
  const { task, col } = props;

  return (
    <div className="taskContainer">
      {col === "DONE" && <Button className="goLeft"></Button>}
      {col === "IN_SESSION" && <Button className="goLeft"></Button>}
      <div className="taskTitle">{task.title}</div>
      {col === "TODO" && <Button className="goRight"></Button>}
      {col === "IN_SESSION" && <Button className="goRight"></Button>}
    </div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.object,
  col: PropTypes.string,
};

export default TaskCard;
