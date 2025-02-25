import React from "react";

const keys = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export default function Keyboard({ onKeyPress }) {
  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.split("").map((key) => (
            <button
              key={key}
              className="key"
              onClick={() => onKeyPress(key.toLowerCase())}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="keyboard-row">
        <button className="key special" onClick={() => onKeyPress("Backspace")}>
          ⌫
        </button>
        <button className="key special" onClick={() => onKeyPress("Enter")}>
          Enter
        </button>
      </div>
    </div>
  );
}
