import React from "react";
import PropTypes from "prop-types";

const TeamDashboardBox = ({
  startRow,
  startColumn,
  endRow,
  endColumn,
  children,
}) => (
  <div
    className="team-dashboard box"
    style={{
      gridArea: `${startRow} / ${startColumn} / ${endRow} / ${endColumn}`,
    }}
  >
    {children}
  </div>
);

TeamDashboardBox.propTypes = {
  startRow: PropTypes.number.isRequired,
  startColumn: PropTypes.number.isRequired,
  endRow: PropTypes.number.isRequired,
  endColumn: PropTypes.number.isRequired,
  children: PropTypes.node,
};

export default TeamDashboardBox;
