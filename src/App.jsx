import { useEffect, useState } from "react";
import "./App.css";
import Line from "./components/Line";
import Popup from "./components/Popup";
import Keyboard from "./components/Keyboard";

import React, { useEffect, useState } from "react";
import Keyboard from "./components/Keyboard"; // Importing Keyboard component
import Line from "./components/Line";
import Popup from "./components/Popup";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", backendUrl);

export default function App() {
  const [solution, setSolution] = useState("");
  const [definition, setDefinition] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentDefinition, setCurrentDefinition] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [victoryScreen, setVictoryScreen] = useState(false);
  const [lost, setLost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedGameState = localStorage.getItem("gameState");
    if (savedGameState) {
      try {
        const parsedState = JSON.parse(savedGameState);
        setSolution(parsedState.solution);
        setDefinition(parsedState.definition);
        setGuesses(parsedState.guesses);
        setCurrentGuess(parsedState.currentGuess);
        setCurrentDefinition(parsedState.currentDefinition);
        setGameOver(parsedState.gameOver);
        setVictoryScreen(parsedState.victoryScreen);
        setLost(parsedState.lost);
        console.log("Game state loaded from localStorage");
      } catch (error) {
        console.error("Error loading game state from localStorage:", error);
      }
    } else {
      console.log("No saved game state found.");
    }
  }, []);

  useEffect(() => {
    if (!solution) return;

    const gameState = {
      solution,
      definition,
      guesses,
      currentGuess,
      currentDefinition,
      gameOver,
      victoryScreen,
      lost,
    };

    try {
      localStorage.setItem("gameState", JSON.stringify(gameState));
      console.log("Game state saved to localStorage");
    } catch (error) {
      console.error("Error saving game state to localStorage:", error);
    }
  }, [
    solution,
    definition,
    guesses,
    currentGuess,
    currentDefinition,
    gameOver,
    victoryScreen,
    lost,
  ]);

  // ✅ Move handleKeyPress outside of useEffect
  const handleKeyPress = (key) => {
    if (gameOver) return;

    setCurrentGuess((prevGuess) => {
      if (key === "Backspace") {
        return prevGuess.slice(0, -1);
      }

      if (key === "Enter") {
        if (prevGuess.length !== 5) return prevGuess;
        validateWord(prevGuess);
        return "";
      }

      if (prevGuess.length >= 5) return prevGuess;

      const isLetter = /^[a-z]$/.test(key);
      if (isLetter) {
        return prevGuess + key;
      }

      return prevGuess;
    });
  };

  useEffect(() => {
    const handleType = (event) => {
      handleKeyPress(event.key);
    };

    window.addEventListener("keydown", handleType);
    return () => window.removeEventListener("keydown", handleType);
  }, [gameOver]);

  const validateWord = async (word) => {
    if (guesses.includes(word)) {
      setCurrentDefinition("You already guessed that word!");
      return;
    }

    try {
      const response = await fetch(backendUrl + "/gets/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });

      const result = await response.json();

      if (!result.definition) {
        setCurrentDefinition("Not a valid word!");
        return;
      }

      setCurrentDefinition(result.definition);

      const newGuesses = [...guesses];
      newGuesses[guesses.findIndex((val) => val == null)] = word;
      setGuesses(newGuesses);
      setCurrentGuess("");

      if (
        guesses.slice(0, -1).every((val) => val !== null) &&
        word !== solution
      ) {
        setGameOver(true);
        setLost(true);
      }

      if (solution === word) {
        setGameOver(true);
        setVictoryScreen(true);
      }
    } catch (error) {
      console.error("Error fetching definition:", error);
      setCurrentDefinition("Error fetching definition.");
    }
  };

  useEffect(() => {
    const fetchWord = async () => {
      const response = await fetch(backendUrl + "/gets/items");
      const wordObj = await response.json();
      const answer = wordObj.word;
      const ansDef = wordObj.definition;
      setSolution(answer);
      setDefinition(ansDef);
    };

    fetchWord();
  }, []);

  return (
    <>
      <div className="app">
        <h1 className="title">Wordle</h1>
        <div className="board">
          {guesses.map((guess, index) => {
            const isCurrentGuess =
              index === guesses.findIndex((val) => val == null);
            return (
              <Line
                key={index}
                guess={isCurrentGuess ? currentGuess : guess ?? ""}
                isFinal={!isCurrentGuess && guess != null}
                solution={solution}
              />
            );
          })}
          <div>
            {definition && <h3 className="def">{currentDefinition}</h3>}
          </div>
          <div>
            <Keyboard onKeyPress={handleKeyPress} />{" "}
            {/* ✅ Pass handleKeyPress */}
          </div>
        </div>
        <Popup trigger={victoryScreen} setTrigger={setVictoryScreen}>
          <h3>You Won!</h3>
          <p>Word: {solution}</p>
          <p>Definition: {definition}</p>
        </Popup>
        <Popup trigger={lost} setTrigger={setLost}>
          <h3>You Lost!</h3>
          <p>Word: {solution}</p>
          <p>Definition: {definition}</p>
        </Popup>
      </div>
    </>
  );
}
