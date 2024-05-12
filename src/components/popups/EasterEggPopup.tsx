import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/popups/EasterEggPopup.scss";
import { Button } from "../ui/Button";
import logo from "../../assets/logo.png";

const generateAsciiGrid = (names) => {
  let grid = [];
  const gridHeight = 10;
  const gridWidth = 30;
  for (let i = 0; i < gridHeight; i++) {
    let row = [];
    for (let j = 0; j < gridWidth; j++) {
      row.push(String.fromCharCode(33 + Math.floor(Math.random() * 90)));
    }
    grid.push(row);
  }

  // Randomly place names within the grid
  names.forEach((name) => {
    const x = Math.floor(Math.random() * gridHeight);
    const y = Math.floor(Math.random() * gridWidth);
    grid[x][y] = name;
  });

  return grid;
};

const nameLinks = {
  Alihan: "https://youtube.com",
  Basil: "https://instagram.com/basilfurrer",
  Sven: "https://github.com",
  Timon: "https://formula1.com",
};

const EasterEggPopup = ({ isOpen, onClose }) => {
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setGrid(generateAsciiGrid(["Alihan", "Basil", "Sven", "Timon"]));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="easter-egg-popup overlay" onClick={onClose}>
      <div
        className="easter-egg-popup content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="easter-egg-popup header">
          <h2>You have found us!</h2>
          <Button className="red-button" onClick={onClose}>
            Close
          </Button>
        </div>
        <img src={logo} alt="Logo" className="easter-egg-popup logo" />
        {grid.map((row, i) => (
          <div key={i} className="grid-row">
            {row.map((cell, j) => (
              <span
                key={j}
                className={
                  ["Alihan", "Basil", "Sven", "Timon"].includes(cell)
                    ? "name"
                    : "char"
                }
              >
                {["Alihan", "Basil", "Sven", "Timon"].includes(cell) ? (
                  <Button
                    className="name-button"
                    onClick={() => window.open(nameLinks[cell], "_blank")}
                  >
                    {cell}
                  </Button>
                ) : (
                  cell
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

EasterEggPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  nameLinks: PropTypes.object.isRequired,
};

export default EasterEggPopup;
