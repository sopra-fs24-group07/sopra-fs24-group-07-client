import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import "../../styles/popups/FAQ.scss";

interface NotificationProps {
  question: string;
  answer: string;
  link?: string;
  onClose: () => void;
}

const FAQEntity: React.FC<NotificationProps> = ({
                                                  question,
                                                  answer,
                                                  link = "",
                                                  onClose,
                                                }) => {
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (link) {
      navigate(link);
      onClose();
    }
  };

  return (
    <div className="faq-entity container">
      <div>{question} <span>&nbsp;</span>{answer}</div>
      {link && (
        <Button className="green-button" onClick={handleLinkClick}>
          Go
        </Button>
      )}
    </div>
  );
};

export default FAQEntity;
