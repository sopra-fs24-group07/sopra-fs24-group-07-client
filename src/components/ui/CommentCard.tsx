import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/CommentCard.scss";
import { useParams } from "react-router-dom";

function CommentCard(props) {
  const { comment } = props;

  return (
    <div className="comContainer">
      {/*task title that opens the task details */}
      <div className="comAuthor">
        {comment.authorName}
      </div>
      <div className="comText">
        {comment.text}
      </div>
    </div>
  );
}

//check prop types
CommentCard.propTypes = {
  comment: PropTypes.object,
};

export default CommentCard;
