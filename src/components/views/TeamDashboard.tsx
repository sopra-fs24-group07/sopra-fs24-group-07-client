import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import BaseContainer from "components/ui/BaseContainer";
import TeamDashboardBox from "components/ui/TeamDashboardBox";
import TeamDashboardSessionBox from "components/ui/TeamDashboardSessionBox";
import KanbanBoard from "components/ui/KanbanBoard";
import StatusComponent from "components/views/StatusComponent";
import ProgressField from 'components/views/ProgressField';
import "styles/views/TeamsOverview.scss";
import "styles/views/TeamDashboard.scss";
import TeamSettings from "components/popups/TeamSetting";

const TeamDashboard: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [sessionStatus, setSessionStatus] = useState<string>('off');
  const [goalMinutes, setGoalMinutes] = useState("00:30");
  const [totalTime, setTotalTime] = useState(null);
  const [startDateTime, setStartDateTime] = useState<string>(null);
  const [userData, setUserData] = useState<any[]>([]);
  const [teamTasks, setTeamTasks] = useState<any[]>([]);
  const [teamName, setTeamName] = useState<any[]>([]);
  const token = localStorage.getItem("token") || "";
  const [isTeamSettingsOpen, setTeamSettingsOpen] = useState(false);

  //open the Inspect Task Popup
  const openTeamSettings = () => {
    setTeamSettingsOpen(true);
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
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get(`/api/v1/teams/${teamId}/users`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error(`Error fetching team's users: ${handleError(error)}`);
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
        console.error(`Error fetching team's tasks: ${handleError(error)}`);
      }
    };

    const fetchTeamName = async () => {
      let userId = localStorage.getItem("id");
      try {
        const response = await api.get(`/api/v1/users/${userId}/teams`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const numericTeamId = Number(teamId);
        const team = response.data.find(team => team.teamId === numericTeamId);

        const teamName = team ? team.name : "Team Name not found!";
        setTeamName(teamName);
      } catch (error) {
        console.error(`Error fetching team's name: ${handleError(error)}`);
      }
    }
    fetchTeamMembers();
    fetchTeamTasks();
    fetchTeamName();
  }, [teamId, token]);

  return (
    <BaseContainer>
      <div className="team-dashboard container">
        <h2>This is the dashboard for {teamName}</h2>
        <div className="team-dashboard grid">
          <TeamDashboardSessionBox startRow={1} startColumn={1} endRow={2} endColumn={2}>
            <StatusComponent sessionStatus={sessionStatus} setSessionStatus={setSessionStatus} goalMinutes={goalMinutes} setGoalMinutes={setGoalMinutes} startDateTime={startDateTime} setStartDateTime={setStartDateTime} totalTime={totalTime} setTotalTime={setTotalTime} />
          </TeamDashboardSessionBox>
          <TeamDashboardBox startRow={2} startColumn={1} endRow={20} endColumn={2}>
            <div>
              Team Members
              <div>
                {userData.map((member) => (
                  <div key={member.id}>{member.username}</div>
                ))}
              </div>
            </div>
          </TeamDashboardBox>
          <TeamDashboardBox startRow={1} startColumn={2} endRow={2} endColumn={3}>
            <ProgressField sessionStatus={sessionStatus} goalMinutes={goalMinutes} startDateTime={startDateTime} totalTime={totalTime} />
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
              <Button onClick={openTeamSettings}>Settings</Button>
            </div>

            <TeamSettings
              isOpen={isTeamSettingsOpen}
              onClose={closeTeamSettings}
            />
            <button disabled className="green-button">Apps</button>
          </TeamDashboardBox>
          <TeamDashboardBox startRow={2} startColumn={2} endRow={20} endColumn={5}>
            <KanbanBoard teamTasks={teamTasks} />
          </TeamDashboardBox>
        </div>
      </div>
    </BaseContainer>
  );
};

export default TeamDashboard;
