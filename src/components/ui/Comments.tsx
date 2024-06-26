import React, { useState, useEffect } from "react";
import "../../styles/ui/Comments.scss";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";
import CommentCard from "./CommentCard";
import Pusher from "pusher-js";
import ConfirmCommentDelete from "components/popups/ConfirmCommentDelete";

import {
  BiCommentDetail,
  BiSolidCommentAdd,
  BiCommentAdd,
} from "react-icons/bi";
import IconButton from "../ui/IconButton";
import FormField from "./FormField";

const Comments = (props) => {
  const { teamId } = useParams();
  const { taskId } = props;
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState();

  const validateForm = () => {
    let isValid = true;

    if (comment.length > 1000) {
      setError("The comment exceeds 1000 characters");
      isValid = false;
    }

    if (comment.length < 1) {
      setError("Please write a comment first");
      isValid = false;
    }

    return isValid;
  };

  const handleDeleteClick = (commi) => {
    setCommentToDelete(commi);
    setDeleteOpen(true);
  };

  const closeDelete = () => {
    setDeleteOpen(false);
  };

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "eu",
      forceTLS: true,
    });

    const channel = pusher.subscribe(`team-${teamId}`);

    channel.bind("comment-update", (data) => {
      fetchComments();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [teamId]);

  const createComment = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      const requestBody = JSON.stringify({ text: comment, userId: userId });
      const response = await api.post(
        `/api/v1/teams/${teamId}/tasks/${taskId}/comments`,
        requestBody,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setError("");
      setComment("");
    } catch (error) {
      console.error("Error creating comment:", handleError(error));
      setError("Could not create Comment");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(
        `/api/v1/teams/${teamId}/tasks/${taskId}/comments`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setAllComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", handleError(error));
      setError("Could not load comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="wrapper">
      {!deleteOpen && (
        <div>
          <h3>Comments</h3>
          <div className="in-line">
            <form onSubmit={createComment}>
              <FormField
                label={"Add comment"}
                value={comment}
                onChange={setComment}
                error={error}
                com={true}
                rightIcon={
                  <IconButton
                    hoverIcon={BiSolidCommentAdd}
                    icon={BiCommentDetail}
                    type="submit"
                    title={"Submit"}
                    className="green-icon"
                    style={{
                      scale: "1.8",
                      marginLeft: "10px",
                      marginBottom: "10px",
                    }}
                  />
                }
              />
            </form>
          </div>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      {!deleteOpen && (
        <div className="section">
          {allComments.map((commi) => (
            <CommentCard
              key={commi.commentId}
              doDelete={() => handleDeleteClick(commi)}
              comment={commi}
            ></CommentCard>
          ))}
        </div>
      )}
      {deleteOpen && (
        <ConfirmCommentDelete
          doClose={closeDelete}
          comment={commentToDelete}
          teamId={teamId}
          taskId={taskId}
        />
      )}
    </div>
  );
};
Comments.propTypes = {
  taskId: PropTypes.number,
};

export default Comments;
