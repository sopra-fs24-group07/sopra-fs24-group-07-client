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

FormField.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
};

const TeamDashboard = () => {
  const { teamId } = useParams();
  const [time, setTime] = useState<string>(null);
  const [userData, setUserData] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        let ID = teamId;
        const response = await api.get(`/api/v1/teams/${ID}/users`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching teams users:", error);
      }
    };

    fetchTeamMembers();

    //TODO: remove fake TeamMember, when API call ready
    const fakeTeamMembers = [
      { id: 1, username: "Monti", name: "Timon" },
      { id: 2, username: "Basil", name: "Basil" },
      { id: 3, username: "Homie1", name: "Frank" },
      { id: 4, username: "Steve", name: "Alex" },
      { id: 5, username: "Lara", name: "Loft" },
      { id: 6, username: "Mario", name: "Luigi" },
      { id: 7, username: "xXDogXx", name: "Cat" },
    ];
    setUserData(fakeTeamMembers);
    //remove until here

    const fetchTeamTasks = async () => {
      try {
        let ID = teamId;
        const response = await api.get(`/api/v1/teams/${ID}/tasks`);
        setTeamTasks(response.data);
      } catch (error) {
        console.error("Error fetching teams tasks:", error);
      }
    };

    fetchTeamTasks();

    //TODO: remove fake TeamMember, when API call ready
    const fakeTeamTasks = [
      { id: 1, title: "intro", status: "TODO" },
      { id: 2, title: "deckblatt", status: "TODO" },
      { id: 3, title: "lesen", status: "TODO" },
      { id: 4, title: "malen", status: "DONE" },
      { id: 5, title: "schreiben", status: "DONE" },
      { id: 6, title: "tanzen", status: "IN_SESSION" },
      { id: 7, title: "singen", status: "IN_SESSION" },
    ];
    setTeamTasks(fakeTeamTasks);
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
            <div className="timeGoalBox">
              Time Goal:
              <FormField onChange={(t) => setTime(t)} />
              <Button width="100%" onClick={() => startGroupSession()}>
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
            Progress Field
          </TeamDashboardBox>
          <TeamDashboardBox
            startRow={1}
            startColumn={3}
            endRow={2}
            endColumn={5}
          >
            Settings Button
          </TeamDashboardBox>
          <TeamDashboardBox
            startRow={2}
            startColumn={2}
            endRow={20}
            endColumn={5}
          >
            <div>
              Task Field
              <table>
                <tr>
                  <th>TODO</th>
                  {teamTasks.map((task) => {
                    if (task.status === "TODO")
                      return <td key={task.id}>{task.title}</td>;
                  })}
                </tr>
                <tr>
                  <th>IN_SESSION</th>
                  {teamTasks.map((task) => {
                    if (task.status === "IN_SESSION")
                      return <td key={task.id}>{task.title}</td>;
                  })}
                </tr>
                <tr>
                  <th>DONE</th>
                  {teamTasks.map((task) => {
                    if (task.status === "DONE")
                      return <td key={task.id}>{task.title}</td>;
                  })}
                </tr>
              </table>
            </div>
          </TeamDashboardBox>
          <TeamDashboardBox
            startRow={20}
            startColumn={2}
            endRow={39}
            endColumn={5}
          >
            Kanban Board
            <KanbanBoard teamTasks={teamTasks}></KanbanBoard>
          </TeamDashboardBox>
        </div>
      </div>
    </BaseContainer>
  );
};

export default TeamDashboard;
