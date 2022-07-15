import { useEffect, useState } from "react";
import "./App.css";
import Line from "./Line";

const API_URL = "http://localhost:3000/getWord";

function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setGameOver] = useState(false);

  const getWord = async () => {
    const response = await fetch(API_URL);
    const word = await response.json();
    setSolution(word.message);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getWord();
    };

    if (solution === "") {
      fetchData().catch(console.error);
    }
  }, [solution]);

  useEffect(() => {
    const handleType = (event) => {
      if (isGameOver) {
        return;
      }

      if (event.key === "Enter") {
        if (currentGuess.length !== solution.length) {
          return;
        }

        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val === null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess("");

        const isCorrect = solution === currentGuess;
        if (isCorrect) {
          setGameOver(true);
        }
      }

      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (solution.length !== 0 && currentGuess.length >= solution.length) {
        return;
      }

      const isLetter = event.key.match(/^[a-z]{1}$/) != null;
      if (isLetter) {
        setCurrentGuess((oldGuess) => oldGuess + event.key);
      }
    };

    window.addEventListener("keydown", handleType);

    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess, isGameOver, solution, guesses]);

  return (
    <div className="App">
      <header className="header">Wordle</header>

      <div className="board">
        {guesses.map((guess, i) => {
          const isCurrentGuess = i === guesses.findIndex((val) => val === null);
          return (
            <Line
              key={i}
              guess={isCurrentGuess ? currentGuess : guess ?? ""}
              wordLength={solution.length}
              isFinal={!isCurrentGuess && guess != null}
              solution={solution}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
