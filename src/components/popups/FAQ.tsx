import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { api } from "helpers/api";
import "../../styles/popups/FAQ.scss";
import IconButton from "../ui/IconButton";
import { PopupHeader } from "../ui/PopupHeader";
import FormField from "../ui/FormField";
import { useNavigate } from "react-router-dom";
import { BiCommentDetail, BiSolidCommentAdd } from "react-icons/bi";

const FAQ = ({ isOpen, onClose }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
  }, [isOpen]);

  const sendQuestion = () => {
    if (!question || question.length < 1 || question === "") {
      setAnswer("");
      setError("Please write a question first");
      return;
    }
    setAnswer("This is the answer to the question "+ question);
    setError("");
    setQuestion("");
  }

  const doClose = () => {
    setAnswer("");
    setQuestion("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="faq-overlay" onClick={doClose}>
      <div className="faq-content" onClick={(e) => e.stopPropagation()}>
        <PopupHeader onClose={doClose} title="FAQ" />
          <div>
            <FormField
              label="Ask a question:"
              type="text"
              value={question}
              onChange={setQuestion}
            >
            </FormField>
            <IconButton
              hoverIcon={BiSolidCommentAdd}
              icon={BiCommentDetail}
              onClick={sendQuestion}
              title={"Submit"}
              className="green-icon"
              style={{
                scale: "1.8",
                marginRight: "10px",
                marginBottom: "10px",
              }}
            />
          </div>
        {answer}
        {error}
        {error && <div className="faq error">{error}</div>}
      </div>
    </div>
  );
};

FAQ.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FAQ;
