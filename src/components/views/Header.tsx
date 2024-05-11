import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/views/Header.scss";
import { Button } from "components/ui/Button";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileMenu from "../popups/ProfileMenu";
import Profile from "../popups/Profile";
import ProfileSettings from "../popups/ProfileSettings";
import EasterEggPopup from "../popups/EasterEggPopup"; // A new component you'll need to create

import IconButton from "../ui/IconButton";
import { MdPerson, MdPersonOutline } from "react-icons/md";

const Header = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isProfileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

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
    setConfirmationMessage("");
  };

  const openProfileSettings = () => {
    setProfileSettingsOpen(true);
    closeProfileMenu();
  };

  const closeProfileSettings = () => {
    setProfileSettingsOpen(false);
  };

  const handleProfileOpenAfterSettings = (showMessage) => {
    setProfileSettingsOpen(false);
    setProfileOpen(true);
    if (showMessage) {
      setConfirmationMessage("Changes have been saved");
    } else {
      setConfirmationMessage("");
    }
  };

  const handleSettingsOpenAfterProfile = () => {
    setProfileOpen(false);
    setProfileSettingsOpen(true);
  };

  const onTitleClick = () => {
    const newCount = titleClickCount + 1;
    if (newCount >= 5) {
      setShowEasterEgg(true);
      setTitleClickCount(0); // Reset count after showing the easter egg
    } else {
      setTitleClickCount(newCount);
    }
  };

  return (
    <div className="header container" style={{ height: props.height }}>
      <div className="header button-container">
        {location.pathname === "/teams" ? (
          <Button className="header disabled-button">Your Teams</Button> //this button should not react to hover
        ) : (
          <Button id="back-button" onClick={() => goTeamsOverview()}>
            {"< Back to Teams"}
          </Button>
        )}
      </div>
      <h1 className="header title" onClick={onTitleClick}>
        PRODUCTIVI<span className="header titlelarge">T</span>EAM
      </h1>
      {showEasterEgg && (
        <EasterEggPopup
          isOpen={showEasterEgg}
          onClose={() => setShowEasterEgg(false)}
        />
      )}
      <div className="header button-container">
        <IconButton
          hoverIcon={MdPerson}
          icon={MdPersonOutline}
          onClick={openProfileMenu}
          style={{ scale: "3.5", marginRight: "25px" }}
        />
        <ProfileMenu
          isOpen={isProfileMenuOpen}
          onClose={closeProfileMenu}
          onProfileClick={openProfile}
          onProfileSettingsClick={openProfileSettings}
        />
        <Profile
          isOpen={isProfileOpen}
          onClose={closeProfile}
          message={confirmationMessage}
          onSettingsOpen={handleSettingsOpenAfterProfile}
        />
        <ProfileSettings
          isOpen={isProfileSettingsOpen}
          onClose={closeProfileSettings}
          onProfileOpen={handleProfileOpenAfterSettings}
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
