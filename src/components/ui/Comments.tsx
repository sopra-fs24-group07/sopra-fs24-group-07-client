import React, { useState, useEffect } from "react";
import "../../styles/ui/Comments.scss";
import { Button } from "./Button";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";

const FormField = ({ value, onChange, error }) => {
  return (
    <div>
      <input
        className="input"
        type="text"
        placeholder="enter comment.."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
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
  const token = localStorage.getItem("token");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [allComments, setAllComments] = useState([]);

  const createComment = async () => {
    try {
      const requestBody = JSON.stringify({ text: comment });
      const response = await api.post(
        `/teams/${teamId}/tasks/${taskId}/comments`,
        requestBody,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log(response);
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
          `/teams/${teamId}/tasks/${taskId}/comments`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log(response.data);
        setAllComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", handleError(error));
        setError("Could not load comments");
      }
    };
    fetchComments();
  }, []);

  return (
    <div>
      <div>
        <FormField value={comment} onChange={setComment} error={error} />
        <Button
          disabled={!comment}
          className="green-button"
          onClick={createComment}
        >
          Submit
        </Button>
      </div>
      <div>
        {/*will add a CommentCard component for this later */}
        {allComments.map((commi) => (
          <div key={commi.commentId}>
            {commi.authorName}: {commi.text}
          </div>
        ))}
      </div>
    </div>
  );
};
Comments.propTypes = {
  taskId: PropTypes.number,
};

export default Comments;
