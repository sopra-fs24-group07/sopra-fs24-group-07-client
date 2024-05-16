import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/popups/FAQ.scss";
import IconButton from "../ui/IconButton";
import { PopupHeader } from "../ui/PopupHeader";
import FormField from "../ui/FormField";
import { useNavigate } from "react-router-dom";
import { BiCommentDetail, BiSolidCommentAdd } from "react-icons/bi";
import { Button } from "../ui/Button";
import FAQEntity from "./FAQEntity";
import { faqList, keywords } from "../../assets/faqs";

const FAQ = ({ isOpen, onClose }) => {
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState("");
  const [faqs, setFaqs] = useState([]);

  const findKeyword = (question) => {
    return keywords.filter((keyword) =>
      question.toLowerCase().includes(keyword)
    );
  };

  const findFAQ = (matchedKeywords) => {
    return faqList.filter((faq) =>
      matchedKeywords.some((keyword) =>
        faq.question.toLowerCase().includes(keyword)
      )
    );
  };

  const showAll = () => {
    setFaqs(faqList);
    setError("");
  };

  const sendQuestion = () => {
    if (!question || question.length < 1 || question === "") {
      setError("Please enter your question or keyword.");
      setFaqs([]);
      return;
    }

    if (question.length > 100) {
      setError("Your question exceeds the 100 character limit.");
      setFaqs([]);
      return;
    }

    const matchedKeywords = findKeyword(question);
    const results = findFAQ(matchedKeywords);

    if (results.length > 0) {
      setFaqs(results);
      setError("");
    } else {
      setFaqs([]);
      setError("");
    }
    setQuestion("");
  };

  const doClose = () => {
    setFaqs([]);
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
            rightIcon={
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
            }
          />
          <Button className="green-button" onClick={showAll}>
            Show all FAQ
          </Button>
        </div>
        <div className="faqs">
          {faqs.map((faq, index) => (
            <FAQEntity
              key={index}
              className="notification popup"
              question={faq.question}
              answer={faq.answer}
              link={faq.link}
              externalLink={faq.externalLink}
              onClose={doClose}
            />
          ))}
        </div>
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
