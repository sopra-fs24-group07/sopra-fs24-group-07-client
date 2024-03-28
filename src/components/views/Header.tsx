// Header.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/views/Header.scss";
import { Button } from "components/ui/Button";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileMenu from "../popups/ProfileMenu";
import Profile from "../popups/Profile"; // Import the ProfilePopup component

const Header = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const goProfile = () => {
    // Temporarily routed to profile using /teams/profile... will probably change later
    navigate("/teams/profile");
    // navigate("/profile");
  };

  const goTeamsOverview = () => {
    navigate("/teams");
  };

  const openProfileMenu = () => {
    setProfileMenuOpen(true);
  };

  const closeProfileMenu = () => {
    setProfileMenuOpen(false);
  };

  const openProfile = () => {
    setProfileOpen(true);
    closeProfileMenu();
  };

  const closeProfile = () => {
    setProfileOpen(false);
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
        <Button onClick={openProfileMenu}>Profile</Button>
        <ProfileMenu
          isOpen={isProfileMenuOpen}
          onClose={closeProfileMenu}
          onProfileClick={openProfile}
        />
        <Profile isOpen={isProfileOpen} onClose={closeProfile} />
      </div>
    </div>
  );
};

Header.propTypes = {
  height: PropTypes.string,
  currentTeam: PropTypes.string,
};

export default Header;
