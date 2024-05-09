import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/ui/IconButton.scss";

const IconButton = (props) => {
  const {
    hoverIcon: HoverIcon,
    icon: Icon,
    toggled: toggled = false,
    ...rest
  } = props;
  const [hover, setHover] = useState(false);

  return (
    <button
      {...rest}
      style={{
        width: props.width,
        background: "none",
        border: "none",
        padding: 0,
        color: "inherit",
        cursor: "pointer",
        ...props.style,
      }}
      className={`icon-button ${props.className}`}
      onMouseEnter={() => setHover(true || toggled)}
      onMouseLeave={() => setHover(false || toggled)}
    >
      {hover && HoverIcon ? (
        <HoverIcon size={20} className={`${props.className}`} />
      ) : (
        <Icon size={20} className={`${props.className}`} />
      )}
      {props.children}
    </button>
  );
};

IconButton.propTypes = {
  hoverIcon: PropTypes.elementType,
  icon: PropTypes.elementType,
  toggled: PropTypes.bool,
  width: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default IconButton;
