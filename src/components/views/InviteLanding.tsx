import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function InviteLanding() {
  const navigate = useNavigate();
  const { teamUUID } = useParams();
  sessionStorage.setItem("teamUUID", teamUUID);
  console.log(teamUUID);

  useEffect(() => {
    if (!sessionStorage.getItem("token") && !sessionStorage.getItem("id")) {
      navigate("/login");
    } else {
      const JoinTeam = async () => {};
    }
  }, []);

  return <div>InviteLanding</div>;
}

export default InviteLanding;
