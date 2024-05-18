import React from "react";
import { Route, Routes } from "react-router-dom";
import TeamsOverview from "../../views/TeamsOverview";
import PropTypes from "prop-types";
import Header from "../../views/Header";
import TeamDashboard from "../../views/TeamDashboard";
import { NotificationProvider } from "../../popups/NotificationContext";

const GameRouter = ({ base }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <NotificationProvider>
        <Header height="100" />
        <Routes>
          <Route path="" element={<TeamsOverview />} />
          <Route path=":teamId" element={<TeamDashboard />} />
        </Routes>
      </NotificationProvider>
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
