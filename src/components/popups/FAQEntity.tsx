import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import "../../styles/popups/FAQS.scss";

interface NotificationProps {
  question: string;
  answer: string;
  link?: string;
  externalLink?: string;
  onClose: () => void;
}

const FAQEntity: React.FC<NotificationProps> = ({
  question,
  answer,
  link = "",
  externalLink = "",
  onClose,
}) => {
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (link) {
      navigate(link);
      onClose();
    }
  };

  const handleExternalLinkClick = () => {
    if (externalLink) {
      window.open(externalLink);
      onClose();
    }
  };

  return (
    <div className="faq-entity container">
      <div>
        <div className="question">{question}</div> <span>&nbsp;</span>
        {answer}
      </div>
      {link && (
        <div className="button-container">
          <span>&nbsp;</span>
          <Button className="green-button-faqs" onClick={handleLinkClick}>
            Go
          </Button>
        </div>
      )}
      {externalLink && (
        <div className="button-container">
          <span>&nbsp;</span>
          <Button className="green-button-faqs" onClick={handleExternalLinkClick}>
            Go
          </Button>
        </div>
      )}
    </div>
  );
};

export default FAQEntity;
