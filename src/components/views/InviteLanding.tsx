import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import "styles/views/InviteLanding.scss";

function InviteLanding() {
  const navigate = useNavigate();
  const { teamUUID } = useParams();
  const [error, setError] = useState("");

  const goBack = () => {
    navigate("/");
  };

  useEffect(() => {
    sessionStorage.setItem("teamUUID", teamUUID);
    if (!localStorage.getItem("token") && !localStorage.getItem("id")) {
      navigate("/login");
    } else {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");

      const JoinTeam = async () => {
        try {
          const requestBody = { teamUUID: teamUUID };
          const response = await api.post(
            `/api/v1/users/${userId}/teams`,
            requestBody,
            {
              headers: { Authorization: `${token}` },
            }
          );
          sessionStorage.removeItem("teamUUID"); //remove teamUUID
          navigate("/teams"); //go to teams overview
        } catch (error) {
          sessionStorage.removeItem("teamUUID"); //remove teamUUID
          setError("Failed to join a team");
          if (error.response.status === 401) {
            setError("You are not authorized to join the team, sorry!");
          } else if (error.response.status === 404) {
            setError("Looks like the Team you tried to join does not exist...");
          }
          console.error("Error joining Team:", handleError(error));
        }
      };

      JoinTeam();
    }
  }, [sessionStorage.getItem("teamUUID")]);

  return (
    <div>
      {error && (
        <BaseContainer className="invite container">
          <div className="invite inside">
            <p className="invite text">{error}</p>
            <Button onClick={goBack}>Go Back</Button>
          </div>
        </BaseContainer>
      )}
    </div>
  );
}

export default InviteLanding;
