import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/views/Header.scss";
import { Button } from "components/ui/Button";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileMenu from "../popups/ProfileMenu";
import Profile from "../popups/Profile";
import ProfileSettings from "../popups/ProfileSettings";

const Header = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isProfileSettingsOpen, setProfileSettingsOpen] = useState(false);

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

  const openProfileSettings = () => {
    setProfileSettingsOpen(true);
    closeProfileMenu(); // Optionally close the profile menu when opening settings
  };

  const closeProfileSettings = () => {
    setProfileSettingsOpen(false);
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
          onProfileSettingsClick={openProfileSettings}
        />
        <Profile isOpen={isProfileOpen} onClose={closeProfile} />
        <ProfileSettings
          isOpen={isProfileSettingsOpen}
          onClose={closeProfileSettings}
        />
      </div>
    </div>
  );
};

Header.propTypes = {
  height: PropTypes.string,
  currentTeam: PropTypes.string,
};

export default Header;
