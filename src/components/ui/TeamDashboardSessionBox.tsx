import React from "react";
import PropTypes from "prop-types";

const TeamDashboardSessionBox = ({
                            startRow,
                            startColumn,
                            endRow,
                            endColumn,
                            children,
                          }) => (
  <div
    className="team-dashboard box-session"
    style={{
      gridArea: `${startRow} / ${startColumn} / ${endRow} / ${endColumn}`,
    }}
  >
    {children}
  </div>
);

TeamDashboardSessionBox.propTypes = {
  startRow: PropTypes.number.isRequired,
  startColumn: PropTypes.number.isRequired,
  endRow: PropTypes.number.isRequired,
  endColumn: PropTypes.number.isRequired,
  children: PropTypes.node,
};

export default TeamDashboardSessionBox;
