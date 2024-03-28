import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/views/Header.scss";
import { Button } from "components/ui/Button";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileMenu from "../popups/ProfileMenu";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://react.dev/learn/your-first-component and https://react.dev/learn/passing-props-to-a-component
 * @FunctionalComponent
 */
const Header = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettings, setSettings] = useState<boolean>(false);

  const goProfile = () => {
    //temporarily routed to profile using /teams/profile... will probably change later
    navigate("/teams/profile");
    //navigate("/profile");
  };

  const goTeamsOverview = () => {
    navigate("/teams");
  };

  return (
    <div className="header container" style={{ height: props.height }}>
      <div className="header button-container">
        {location.pathname === "/teams" ? (
          <span>Your Teams</span>
        ) : (
          <Button onClick={() => goTeamsOverview()}>{"< Back to Teams"}</Button>
        )}
      </div>
      <h1 className="header title">
        PRODUCTIVI<span className="header titlelarge">T</span>EAM
      </h1>
      <div className="header button-container">
        <Button onClick={() => setSettings(true)}>Profile</Button>
        <ProfileMenu isOpen={isSettings} onClose={() => setSettings(false)} />
      </div>
    </div>
  );
};

Header.propTypes = {
  height: PropTypes.string,
  currentTeam: PropTypes.string,
};

/**
 * Don't forget to export your component!
 */
export default Header;
