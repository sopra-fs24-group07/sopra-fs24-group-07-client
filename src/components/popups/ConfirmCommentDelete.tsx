import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import CommentCard from "components/ui/CommentCard";


const ConfirmCommentDelete = (props) => {
  const {comment, teamId, taskId, doClose} = props;
  const [deleteError, setDeleteError] = useState();
  const token = localStorage.getItem("token");

  const deleteComment = async () => {
    try {
      const response = await api.delete(
        `/api/v1/teams/${teamId}/tasks/${taskId}/comments/${comment.commentId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error deleting comment", handleError(error));
      setDeleteError("Could not delete the comment");
    }
  };

  const onConfirm = () => {
    deleteComment()
    doClose()
  }

  const onCancel = () => {
    doClose()
  }

  return (
      <div>
        <div>You are about to delete this comment</div>
        <CommentCard comment={comment} isFake={true}></CommentCard>
        <div>This action cannot be reverted</div>
        <Button className="green-button comDeleteConfirm" onClick={onConfirm}>Confirm Deletion</Button>
        <Button className="red-button" onClick={onCancel}>Cancel</Button>
      </div>
  );
};

ConfirmCommentDelete.propTypes = {
  comment: PropTypes.object,
  taskId: PropTypes.number,
  teamId: PropTypes.number,
  doClose: PropTypes.function,
};



export default ConfirmCommentDelete;
