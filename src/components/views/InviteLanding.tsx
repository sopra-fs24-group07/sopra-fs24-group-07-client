import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";

function InviteLanding() {
  const navigate = useNavigate();
  const { teamUUID } = useParams();
  sessionStorage.setItem("teamUUID", teamUUID);
  console.log(teamUUID);

  useEffect(() => {
    if (!sessionStorage.getItem("token") || !sessionStorage.getItem("id")) {
      navigate("/login");
    } else {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("id");

      const JoinTeam = async () => {
        try {
          //const requestBody = JSON.stringify(teamUUID);
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
          console.error("Error joining team:", handleError(error));
          //display some error
          //remove teamUUID
        }
      };

      JoinTeam();
    }
  }, []);

  return <div>InviteLanding</div>;
}

export default InviteLanding;
