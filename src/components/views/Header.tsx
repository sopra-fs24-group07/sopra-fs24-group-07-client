import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/views/Header.scss";
import { Button } from "components/ui/Button";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "../popups/Profile";
import ProfileSettings from "../popups/ProfileSettings";
import EasterEggPopup from "../popups/EasterEggPopup";
import IconButton from "../ui/IconButton";
import {
  MdPerson,
  MdPersonOutline,
  MdOutlineQuestionMark,
} from "react-icons/md";
import FAQ from "../popups/FAQ";

const Header = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isProfileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [isFAQOpen, setFAQOpen] = useState(false);

  const goTeamsOverview = () => {
    navigate("/teams");
  };

  const openProfile = () => {
    setProfileOpen(true);
  };

  const closeProfile = () => {
    setProfileOpen(false);
    setConfirmationMessage("");
  };

  const openFAQ = () => {
    setFAQOpen(true);
  };

  const closeFAQ = () => {
    setFAQOpen(false);
  };

  const openProfileSettings = () => {
    setProfileSettingsOpen(true);
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
      <div className="header left">
        {location.pathname === "/teams" ? (
          <h3>Your Teams</h3>
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
      <div className="header right">
        <IconButton
          hoverIcon={MdOutlineQuestionMark}
          icon={MdOutlineQuestionMark}
          title={"FAQ"}
          onClick={openFAQ}
          style={{ scale: "3", marginRight: "25px" }}
        />
        <IconButton
          hoverIcon={MdPerson}
          icon={MdPersonOutline}
          title={"Menu"}
          onClick={openProfile}
          style={{ scale: "3.5", marginRight: "25px" }}
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
        <FAQ isOpen={isFAQOpen} onClose={closeFAQ} />
      </div>
    </div>
  );
};

Header.propTypes = {
  height: PropTypes.string,
  currentTeam: PropTypes.string,
};

export default Header;
