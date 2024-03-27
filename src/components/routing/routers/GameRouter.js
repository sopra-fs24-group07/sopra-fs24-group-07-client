import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Game from "../../views/Game";
import TeamsOverview from "../../views/TeamsOverview";
import PropTypes from "prop-types";
import Header from "../../views/Header";
import TeamDashboard from "../../views/TeamDashboard";

const GameRouter = ({ base }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header height="100" />
      <Routes>
        <Route path="" element={<TeamsOverview />} />
        <Route path=":teamId" element={<TeamDashboard />} />
      </Routes>
    </div>
  );
};
/*
 * Don't forget to export your component!
 */

GameRouter.propTypes = {
  base: PropTypes.string,
};

export default GameRouter;
