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
    { question: "What stocks should I invest next?", answer: "For investment advice you can consult our trusted advisor:", externalLink: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/A_curious_Welsh_Mountain_sheep_%28Ovis_aries%29.jpg/2880px-A_curious_Welsh_Mountain_sheep_%28Ovis_aries%29.jpg" },
    { question: "How do I create a new team?", answer: "To create a new team, go to your overview page and click the 'Create Team' button." },
    { question: "Can I change the team name after creating it?", answer: "Yes, you can change the team name in the team settings." },
    { question: "How do I add members to my team?", answer: "Go to your team page and click the 'Add Member' button, then enter their email address." },
    { question: "Can I remove a member from my team?", answer: "Yes, you can remove a member by going to the team page, clicking on their profile, and selecting 'Remove Member.'" },
    { question: "How do I assign tasks to team members?", answer: "You can assign tasks by clicking on the task and selecting a team member from the dropdown menu." },
    { question: "Can I set deadlines for tasks?", answer: "Yes, you can set deadlines by editing the task and selecting a due date." },
    { question: "What happens if I miss a task deadline?", answer: "The task will be marked as overdue, and you will receive a notification." },
    { question: "How can I track the progress of my team's tasks?", answer: "You can track progress on the team overview page where all tasks and their statuses are displayed." },
    { question: "Can I create sub-tasks within a task?", answer: "Yes, you can create sub-tasks by editing the main task and adding sub-tasks in the details section." },
    { question: "How do I prioritize tasks?", answer: "You can prioritize tasks by assigning them different priority levels in the task settings." },
    { question: "Can I export my tasks to a spreadsheet?", answer: "Yes, you can export tasks by going to the task overview page and clicking 'Export to CSV.'" },
    { question: "How do I integrate with other productivity tools?", answer: "Go to the integrations page in settings and follow the instructions to connect other tools." },
    { question: "Can I receive email notifications for task updates?", answer: "Yes, you can enable email notifications in your profile settings." },
    { question: "How do I join a team if I have an invitation link?", answer: "Click the invitation link, log in, and you will be added to the team." },
    { question: "What should I do if I forget my password?", answer: "Click on the 'Forgot Password' link on the login page to reset your password." },
    { question: "How can I see my task history?", answer: "You can view your task history by going to your profile page and selecting 'Task History.'" },
    { question: "Can I customize the appearance of my profile?", answer: "Yes, you can customize your profile appearance in the profile settings." },
    { question: "How do I report a bug or issue?", answer: "Report bugs or issues by clicking the 'Report a Bug' link in the help section." },
    { question: "Can I set recurring tasks?", answer: "Yes, you can set recurring tasks by selecting the recurrence option in the task settings." },
    { question: "How do I deactivate my account temporarily?", answer: "You can deactivate your account temporarily by going to account settings and selecting 'Deactivate Account.'" },
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
          <Button className="green-button" onClick={showAll}>Show all FAQ</Button>
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
