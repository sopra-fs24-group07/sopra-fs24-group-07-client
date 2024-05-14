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
    { question: "What is your return policy?", answer: "Our return policy allows returns within 30 days of purchase with a receipt.", link: "/teams" },
    { question: "How can I contact customer service?", answer: "You can contact customer service via email at support@example.com or call us at 123-456-7890." },
    { question: "Do you offer international shipping?", answer: "Yes, we offer international shipping to most countries. Additional fees may apply." },
    { question: "How much do I pay for shipping?", answer: "The prices for shipping depend on the country you are from." },
    { question: "How do I track my order?", answer: "You can track your order using the tracking link sent to your email after the order is shipped." },
    { question: "What payment methods do you accept?", answer: "We accept Visa, MasterCard, American Express, Discover, and PayPal." },
    { question: "Can I change or cancel my order?", answer: "Orders can be changed or canceled within 24 hours of placing them. Please contact customer service." },
    { question: "Do you offer gift cards?", answer: "Yes, we offer gift cards in various denominations. They can be purchased online or in-store." },
    { question: "What are your store hours?", answer: "Our store hours are Monday to Friday, 9 AM to 6 PM, and Saturday, 10 AM to 4 PM." },
    { question: "How do I reset my password?", answer: "To reset your password, click on 'Forgot Password' at the login page and follow the instructions." },
    { question: "Do you have a loyalty program?", answer: "Yes, we have a loyalty program that rewards points for every purchase. Points can be redeemed for discounts." },
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
      setError("Please write a question first");
      setAnswer("");
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
