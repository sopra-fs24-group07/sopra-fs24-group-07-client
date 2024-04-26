import React from "react";
import "../../styles/ui/Spinner.scss";

export const Spinner = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000, // Ensures it is on top of other elements
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  </div>
);
