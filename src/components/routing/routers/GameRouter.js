import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Game from "../../views/Game";
import PropTypes from "prop-types";
import Header from "../../views/Header";

const GameRouter = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header height="100" />
      <Routes>
        <Route path="" element={<Game />} />

        <Route path="dashboard" element={<Game />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
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
