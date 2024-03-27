import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Game from "../../views/Game";
import TeamsOverview from "../../views/TeamsOverview";
import PropTypes from "prop-types";
import Header from "../../views/Header";

const GameRouter = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header height="100" />
      <Routes>
        <Route path="" element={<TeamsOverview />} />

        <Route path="teams" element={<TeamsOverview />} />

        <Route path="*" element={<Navigate to="teams" replace />} />
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
