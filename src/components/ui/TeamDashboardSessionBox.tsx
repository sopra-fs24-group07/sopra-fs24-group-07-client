import React from "react";
import PropTypes from "prop-types";

const TeamDashboardSessionBox = ({
  startRow,
  startColumn,
  endRow,
  endColumn,
  children,
}) => (
  <div>
    <div
      className="team-dashboard box"
      style={{
        gridArea: `${startRow} / ${startColumn} / ${endRow} / ${endColumn}`,
      }}
    >
      <div>{children}</div>
    </div>
  </div>
);

TeamDashboardSessionBox.propTypes = {
  startRow: PropTypes.number.isRequired,
  startColumn: PropTypes.number.isRequired,
  endRow: PropTypes.number.isRequired,
  endColumn: PropTypes.number.isRequired,
  children: PropTypes.node,
  title: PropTypes.string,
};

export default TeamDashboardSessionBox;
