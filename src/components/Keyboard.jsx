import React from "react";

const Keyboard = ({ onKeyPress }) => {
  const keys = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button key={key} onClick={() => onKeyPress(key)} className="key">
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      ))}
      <div className="keyboard-row">
        <button onClick={() => onKeyPress("Enter")} className="key special-key">
          Enter
        </button>
        <button
          onClick={() => onKeyPress("Backspace")}
          className="key special-key"
        >
          ⌫
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
