import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";
import "../../styles/ui/TaskCard.scss";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "./Button";
import { Link, useParams } from "react-router-dom";
import InspectTask from "components/popups/InspectTask";
import { useDraggable } from "@dnd-kit/core";

import IconButton from "../ui/IconButton";
import { IoMdOpen } from "react-icons/io";

function TaskCard(props) {
  const token = localStorage.getItem("token");
  const { task, col, sessionStatus, dragStyle, openInspectTask } = props;
  const { teamId } = useParams();
  const taskId = task.taskId;

  //dnd
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: taskId,
    data: task,
  });
  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <>
      <div
        className="taskContainer"
        ref={setNodeRef}
        style={{ ...style, ...dragStyle }}
      >
        {/*task title that opens the task details */}
        <div className="taskTitle" {...listeners} {...attributes}>
          {task.title}
        </div>
        <IconButton
          onClick={() => openInspectTask(task)}
          classNameButton="inspectButton"
          className="inspectIcon"
          hoverIcon={IoMdOpen}
          icon={IoMdOpen}
        />
      </div>
    </>
  );
}

//check prop types
TaskCard.propTypes = {
  task: PropTypes.object,
  col: PropTypes.string,
  sessionStatus: PropTypes.string,
  dragStyle: PropTypes.object,
  openInspectTask: PropTypes.function,
};

export default TaskCard;
