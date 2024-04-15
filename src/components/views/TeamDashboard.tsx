import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { Form, useParams } from "react-router-dom";
import "styles/views/TeamsOverview.scss";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/TeamDashboard.scss";
import TeamDashboardBox from "components/ui/TeamDashboardBox";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import KanbanBoard from "components/ui/KanbanBoard";
import TeamSettings from "components/popups/TeamSetting";

//formfiel for Time Goal
const FormField = (props) => {
  return (
    <input
      className="timeInput"
      placeholder="Enter time Goal"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};

//check for numer as input
FormField.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
};

const TeamDashboard = () => {
  const { teamId } = useParams();
  const [time, setTime] = useState<string>(null);
  //user Data, i.e. the users that are in a team
  const [userData, setUserData] = useState([]);
  //the Tasks of a team
  const [teamTasks, setTeamTasks] = useState([]);
  const token = localStorage.getItem("token");
  const [isTeamSettingsOpen, setTeamSettingsOpen] = useState(false);

  //open the Inspect Task Popup
  const openTeamSettings = () => {
    setTeamSettingsOpen(true);
  };

  //close the Inspect Task Popup
  const closeTeamSettings = () => {
    setTeamSettingsOpen(false);
  };

  useEffect(() => {
    //get the team members from the backend
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get(`/api/v1/teams/${teamId}/users`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error(`Error fetching teams users: ${handleError(error)}`);
      }
    };

    fetchTeamMembers();

    //TODO: should I move this to KanbanBoard for refreshing?
    //get the tasks of a team from the Backend
    const fetchTeamTasks = async () => {
      try {
        const response = await api.get(`/api/v1/teams/${teamId}/tasks`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setTeamTasks(response.data);
      } catch (error) {
        console.error(`Error fetching teams tasks: ${handleError(error)}`);
      }
    };

    fetchTeamTasks();
  }, []);

  //TODO: add startGroupSession with time goal and tasks
  function startGroupSession() {
    throw new Error("Function not implemented.");
  }

  return (
    <BaseContainer>
      <div className="team-dashboard container">
        <h2>This is the dashboard for team {teamId}</h2>
        <div className="team-dashboard grid">
          <TeamDashboardBox
            startRow={1}
            startColumn={1}
            endRow={2}
            endColumn={2}
          >
            <div className="timeGoalBox">
              Time Goal:
              <FormField onChange={(t) => setTime(t)} />
              {/*TODO: enable button when Session is implemented */}
              <Button disabled width="100%" onClick={() => startGroupSession()}>
                Start Group Session
              </Button>
            </div>
          </TeamDashboardBox>
          <TeamDashboardBox
            startRow={2}
            startColumn={1}
            endRow={20}
            endColumn={2}
          >
            <div>
              {/* Mapping of the Team Members */}
              Team Members
              <div>
                {userData.map((member) => (
                  <div key={member.id}>{member.username}</div>
                ))}
              </div>
            </div>
          </TeamDashboardBox>
          <TeamDashboardBox
            startRow={1}
            startColumn={2}
            endRow={2}
            endColumn={3}
          >
            {/* TODO Implement Time Progress */}
            Progress Field
          </TeamDashboardBox>
          <TeamDashboardBox
            startRow={1}
            startColumn={3}
            endRow={2}
            endColumn={5}
          >
            {/* TODO Implement Team Settings */}
            <div>
              <Button onClick={openTeamSettings}>Team Settings</Button>
            </div>

            <TeamSettings
              isOpen={isTeamSettingsOpen}
              onClose={closeTeamSettings}
            />
          </TeamDashboardBox>
          <TeamDashboardBox
            startRow={2}
            startColumn={2}
            endRow={20}
            endColumn={5}
          >
            <div>
              {/* The KanbanBoard which takes the Team Tasks */}
              Kanban Board
              <KanbanBoard teamTasks={teamTasks}></KanbanBoard>
            </div>
          </TeamDashboardBox>
        </div>
      </div>
    </BaseContainer>
  );
};

export default TeamDashboard;
