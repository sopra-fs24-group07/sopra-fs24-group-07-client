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

const FAQ = ({ isOpen, onClose }) => {
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState("");
  const [faqs, setFaqs] = useState([]);

  const faqList = [
    { question: "Where can I find my teams?", answer: "You can see all your teams on you overview page.", link: "/teams" },
    { question: "Where can I edit my profile?", answer: "You can see and edit your profile when clicking the profile icon in the top right." },
    { question: "How do I change my password?", answer: "To change your password, click on the profile icon in the top right and enter the edit mode." },
    { question: "How many teams can I create?", answer: "There is currently no limit to the number of teams per user." },
    { question: "What happens if I delete my account?", answer: "Your account and all your data will be erased from our system. There is no way to recover it." },
    { question: "I accidentally left my team.", answer: "Ask a team member to invite you again or contact an administrator." },
    { question: "How can I contact an administrator?", answer: "Talk to them at university or email productiviteam.soprafs24@gmail.com." },
    { question: "I accidentally deleted a task.", answer: "Ask an administrator, most of the time they can recover it." },
    { question: "Which stock should I invest next?", answer: "Visit our investment guide:", externalLink: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/A_curious_Welsh_Mountain_sheep_%28Ovis_aries%29.jpg/1920px-A_curious_Welsh_Mountain_sheep_%28Ovis_aries%29.jpg" },
  ];

  const keywords = ["return policy", "contact", "shipping", "track order", "payment methods", "change order", "gift cards", "store hours", "password", "loyalty program"];

  const findKeyword = (question) => {
    return keywords.filter(keyword => question.toLowerCase().includes(keyword));
  }

  const findFAQ = (matchedKeywords) => {
    return faqList.filter(faq => matchedKeywords.some(keyword => faq.question.toLowerCase().includes(keyword)));
  }

  const showAll = () => {
    setFaqs(faqList);
    setError("");
  }

  const sendQuestion = () => {
    if (!question || question.length < 1 || question === "") {
      setError("Please enter your question or keyword.");
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
  }

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
          />
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
          <Button className="green-button" onClick={showAll}>Show all FAQ</Button>
        </div>
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
