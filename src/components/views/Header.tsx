import React from "react";
import PropTypes from "prop-types";
import "../../styles/views/Header.scss";
import { Button } from "components/ui/Button";
import { useLocation, useNavigate } from "react-router-dom";

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
  const goProfile = () => {
    navigate("/profile");
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
          <Button onClick={() => goTeamsOverview()}>
            {"< Back to Teams | " + props.currentTeam}
          </Button>
        )}
      </div>
      <h1 className="header title">
        PRODUCTIVI<span className="header titlelarge">T</span>EAM
      </h1>
      <div className="header button-container">
        <Button onClick={() => goProfile()}>PROFILE</Button>
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
