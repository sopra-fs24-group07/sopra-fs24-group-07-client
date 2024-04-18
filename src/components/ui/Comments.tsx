import React, {useState} from 'react'
import "../../styles/ui/Comments.scss";
import { Button } from './Button';
import { useParams } from 'react-router-dom';
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";

const FormField = ({value, onChange, error }) => {
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
  const {teamId} = useParams();
  const {taskId} = props;
  const token = localStorage.getItem("token");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const createComment = async () => {
    try {
      const requestBody = JSON.stringify({text: comment});
      const response = await api.post(`/teams/${teamId}/tasks/${taskId}/comments`, requestBody, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(response)
    }catch (error) {
    console.error("Error creating comment:", handleError(error));
    setError("Sending the comment failed")
    } 
  }
  return (
    <div>
      <FormField
        value={comment}
        onChange={setComment}
        error={error}
      />
      <Button disabled={!comment} className="green-button" onClick={createComment}>Submit</Button>
    </div>
  )
  
}
Comments.propTypes = {
  taskId: PropTypes.number
}

export default Comments;