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
import { IoMdEye } from "react-icons/io";
import { BsEye, BsEyeFill } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";

function TaskCard(props) {
  const token = localStorage.getItem("token");
  const { task, col, sessionStatus, dragStyle } = props;
  const { teamId } = useParams();
  const taskId = task.taskId;
  const [isInspectTaskOpen, setInspectTaskOpen] = useState(false);

  //dnd
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: taskId,
    data: task,
  });
  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  //open the Inspect Task Popup
  const openInspectTask = () => {
    setInspectTaskOpen(true);
  };

  //close the Inspect Task Popup
  const closeInspectTask = () => {
    setInspectTaskOpen(false);
  };

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
          onClick={openInspectTask}
          className="inspectButton"
          hoverIcon={IoMdEye}
          icon={IoMdEye}
          style={{ scale: "1.0" }}
        />
      </div>
      <InspectTask
        isOpen={isInspectTaskOpen}
        onClose={closeInspectTask}
        task={task}
        inSession={false}
      />
    </>
  );
}

//check prop types
TaskCard.propTypes = {
  task: PropTypes.object,
  col: PropTypes.string,
  sessionStatus: PropTypes.string,
  dragStyle: PropTypes.object,
};

export default TaskCard;
