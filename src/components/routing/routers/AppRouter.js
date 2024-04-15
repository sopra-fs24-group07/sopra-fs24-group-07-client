import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import Registration from "../../views/Registration";
import Landing from "../../views/Landing";
import InviteLanding from "../../views/InviteLanding";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/teams/*" element={<GameGuard />}>
          <Route path="*" element={<GameRouter base="/teams" />} />
        </Route>

        <Route path="/register" element={<LoginGuard />}>
          <Route path="/register" element={<Registration />} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/start" element={<LoginGuard />}>
          <Route path="/start" element={<Landing />} />
        </Route>

        <Route path="/invitation">
          <Route path=":teamUUID" element={<InviteLanding />} />
        </Route>

        <Route path="/" element={<Navigate to="/teams" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
