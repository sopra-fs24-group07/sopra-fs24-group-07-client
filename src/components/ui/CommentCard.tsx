import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/CommentCard.scss";
import { useParams } from "react-router-dom";

function CommentCard(props) {
  const { comment } = props;
  const creationDate = new Date(comment.creationDate).toLocaleDateString("de", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="comContainer">
      {/*task title that opens the task details */}
      <div className="comAuthor">{comment.authorName}</div>
      <div className="comText">{comment.text}</div>
      <div className="comDate">{creationDate}</div>
    </div>
  );
}

//check prop types
CommentCard.propTypes = {
  comment: PropTypes.object,
};

export default CommentCard;
