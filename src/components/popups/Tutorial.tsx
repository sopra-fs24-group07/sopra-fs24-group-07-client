import React from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useLocation } from "react-router-dom";
import "styles/popups/Tutorial.scss";

const TutorialPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const location = useLocation();
  const dashboardTutorial =
    location.pathname.includes("/teams/") &&
    location.pathname.split("/").length === 3;
  const overviewTutorial = location.pathname === "/teams";

  return (
    <div className="tutorial content">
      <p>Welcome to the tutorial!</p>
      {overviewTutorial ? (
        <div>
          <h1>Overview Tutorial</h1>
          <h3>Create Team</h3>
          <p>
            Click on the Create Team button to create your first team! After
            setting a team name, you can either write your own description, or
            click on the orange wand button to automatically generate a team
            description.
          </p>
        </div>
      ) : (
        <div>
          <h1>Dashboard Tutorial</h1>
          <h3>Kanban Board</h3>
          <p>
            A Kanban board is a visual project management tool that helps to
            optimize the flow of work among a team. It is divided into different
            columns, each representing a different stage of the workflow. The
            board provides a visual representation of the work in progress and
            helps teams to identify bottlenecks and manage workloads
            effectively. You can drag and drop your tasks into one of the
            following three columns.
            <ul>
              <li>
                TODO column: List of all the tasks you haven&#39;t started yet
              </li>
              <li>
                NEXT SESSION column: List of all the tasks you want to work on
                in the next session
              </li>
              <li>DONE column: List of all your finished tasks</li>
            </ul>
          </p>
          <h3>Session Start</h3>
          <p>
            You can set a time goal and start the group session by clicking on
            the button underneath the time goal. The tasks that have been
            dragged to Next Session in the Kanban board will be automatically
            migrated to the session task board.
          </p>
          <h3>Voice Chat</h3>
          <p>
            You can join a VoiceChat by clicking on one of the channels during a
            session. You will always have a main channel, and all the other
            channels are the breakout rooms for the active tasks. You can mute
            yourself by clicking on the microphone button. By clicking on the
            red phone button, you will leave the voice chat, and by clicking on
            a new task, you will enter a new voice chat.
          </p>
          <h3>Sessions History</h3>
          <p>
            Click on the Session History Button to get a list of your teams past
            sessions.
          </p>
          <h3>Comments</h3>
          <p>
            By clicking on the symbol next to a task inside the Kanban board,
            you can see details or add comments for the selected task.
          </p>
        </div>
      )}
      <Button className="green-button-large" onClick={onClose}>
        Got it!
      </Button>
    </div>
  );
};

TutorialPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TutorialPopup;
