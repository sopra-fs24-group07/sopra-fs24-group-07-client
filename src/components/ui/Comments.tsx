import React, { useState, useEffect } from "react";
import "../../styles/ui/Comments.scss";
import { Button } from "./Button";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";
import CommentCard from "./CommentCard";

const FormField = ({ value, onChange, error }) => {
  return (
    <input
      className="input"
      type="text"
      placeholder="enter comment.."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

FormField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

const Comments = (props) => {
  const { teamId } = useParams();
  const { taskId } = props;
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [allComments, setAllComments] = useState([]);

  const validateForm = () => {
    let isValid = true;

    if (comment.length > 500) {
      setError("The comment exceeds 500 characters");
      isValid = false;
    }

    return isValid;
  };

  const createComment = async () => {
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

  useEffect(() => {
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
    fetchComments();
  }, []);

  return (
    <div className="wrapper">
      <div className="in-line">
        <FormField value={comment} onChange={setComment} error={error} />
        <Button
          disabled={!comment}
          className={"green-button submit"}
          onClick={createComment}
        >
          Submit
        </Button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="section">
        {allComments.map((commi) => (
          <CommentCard key={commi.commentId} comment={commi}></CommentCard>
        ))}
      </div>
    </div>
  );
};
Comments.propTypes = {
  taskId: PropTypes.number,
};

export default Comments;
