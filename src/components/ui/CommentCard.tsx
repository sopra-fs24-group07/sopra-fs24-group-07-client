import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/CommentCard.scss";
import { useParams } from "react-router-dom";
import { Button } from "./Button";

function CommentCard(props) {
  const { comment, doDelete, isFake } = props;
  const creationDate = new Date(comment.creationDate).toLocaleString("de-DE", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <div className="comContainer">
      <div className="comHeader">
        <div className="comAuthor">{comment.authorName}</div>
        {!isFake && (
          <Button
            className="red-button comDelete"
            onClick={() => doDelete(comment)}
          >
            DELETE
          </Button>
        )}
      </div>
      <div className="comText">{comment.text}</div>
      <div className="comDate">{creationDate}</div>
    </div>
  );
}

//check prop types
CommentCard.propTypes = {
  comment: PropTypes.object.required,
  doDelete: PropTypes.function,
  isFake: PropTypes.boolean,
};

export default CommentCard;
