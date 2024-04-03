import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { Form, useParams } from "react-router-dom";
import "styles/views/TeamsOverview.scss";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/TeamDashboard.scss";
import TeamDashboardBox from "components/ui/TeamDashboardBox";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";

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
  let [userData, setUserData] = useState([]);

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
      { id: 1, username: "Monti" },
      { id: 2, username: "Basil" },
      { id: 3, username: "Homie1" },
      { id: 4, username: "Steve" },
      { id: 5, username: "Lara" },
      { id: 6, username: "Mario" },
      { id: 7, username: "xXDogXx" },
    ];
    setUserData(fakeTeamMembers);
    //remove until
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
            Task Field
          </TeamDashboardBox>
        </div>
      </div>
    </BaseContainer>
  );
};

export default TeamDashboard;
