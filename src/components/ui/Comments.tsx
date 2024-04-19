import React, { useState, useEffect } from "react";
import "../../styles/ui/Comments.scss";
import { Button } from "./Button";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";
import CommentCard from "./CommentCard";

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
        `/api/v1/teams/${teamId}/tasks/${taskId}/comments`,
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
          `/api/v1/teams/${teamId}/tasks/${taskId}/comments`,
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <FormField value={comment} onChange={setComment} error={error} />
        <Button
          style={{ marginBottom: "10px" }}
          disabled={!comment}
          className="green-button"
          onClick={createComment}
        >
          Submit
        </Button>
      </div>
      <div className="section">
        {/*will add a CommentCard component for this later */}
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
