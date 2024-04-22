import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/MemberCard.scss";

const MemberCard = (props) => {
  const { MemberName } = props;

  return (
    <div className="memCard">
      <div className="memName">{MemberName}</div>
    </div>
  );
};

MemberCard.propTypes = {
  MemberName: PropTypes.object,
};

export default MemberCard;
