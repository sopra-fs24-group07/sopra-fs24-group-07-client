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

const TeamDashboard: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [sessionStatus, setSessionStatus] = useState<string>('off');
  const [time, setTime] = useState<string>('00:30');
  const [userData, setUserData] = useState<any[]>([]);
  const [teamTasks, setTeamTasks] = useState<any[]>([]);
  const token = localStorage.getItem("token") || "";

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

    fetchTeamMembers();
    fetchTeamTasks();
  }, [teamId, token]);

  return (
    <BaseContainer>
      <div className="team-dashboard container">
        <h2>This is the dashboard for team {teamId}</h2>
        <div className="team-dashboard grid">
          <TeamDashboardSessionBox startRow={1} startColumn={1} endRow={2} endColumn={2}>
            <StatusComponent sessionStatus={sessionStatus} setSessionStatus={setSessionStatus} time={time} setTime={setTime} />
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
            <ProgressField sessionStatus={sessionStatus} time={time} />
          </TeamDashboardBox>
          <TeamDashboardBox startRow={1} startColumn={3} endRow={2} endColumn={5}>
            <button disabled className="green-button">Settings</button>
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
