import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { Form, useParams } from "react-router-dom";
import "styles/views/TeamsOverview.scss";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/TeamDashboard.scss";
import TeamDashboardBox from "components/ui/TeamDashboardBox";
import { Button } from "components/ui/Button";
import KanbanBoard from "components/ui/KanbanBoard";
import StatusComponent from "components/views/StatusComponent";


const TeamDashboard = () => {
  const { teamId } = useParams();
  const [time, setTime] = useState<string>(null);
  //user Data, i.e. the users that are in a team
  const [userData, setUserData] = useState([]);
  //the Tasks of a team
  const [teamTasks, setTeamTasks] = useState([]);
  const token = localStorage.getItem("token");

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

    //TODO: remove fake TeamMember, when API call ready
    //const fakeTeamMembers = [
    //  { id: 1, username: "Monti", name: "Timon" },
    //  { id: 2, username: "Basil", name: "Basil" },
    //  { id: 3, username: "Homie1", name: "Frank" },
    //  { id: 4, username: "Steve", name: "Alex" },
    //  { id: 5, username: "Lara", name: "Loft" },
    //  { id: 6, username: "Mario", name: "Luigi" },
    //  { id: 7, username: "xXDogXx", name: "Cat" },
    //];
    //setUserData(fakeTeamMembers);
    //remove until here

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

    //TODO: remove fake TeamTask, when API call ready
    const fakeTeamTasks = [
      { id: 1, title: "intro", description: "Lorem ipsum", status: "TODO" },
      { id: 2, title: "deckblatt", description: "Lorem ipsum", status: "TODO" },
      { id: 3, title: "lesen", description: "Lorem ipsum", status: "TODO" },
      { id: 4, title: "malen", description: "Lorem ipsum", status: "DONE" },
      { id: 5, title: "schreiben", description: "Lorem ipsum", status: "DONE" },
      {
        id: 6,
        title: "tanzen",
        description: "Lorem ipsum",
        status: "IN_SESSION",
      },
      {
        id: 7,
        title: "singen",
        description: "Lorem ipsum",
        status: "IN_SESSION",
      },
    ];
    //setTeamTasks(fakeTeamTasks);
    //remove until here
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
            <StatusComponent> </StatusComponent>
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
            Settings Button
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
