import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/TaskCard.scss";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TaskCard(props) {
  const { task } = props;

  return <div className="taskContainer">{task.title}</div>;
}

TaskCard.propTypes = {
  task: PropTypes.object,
};

export default TaskCard;
