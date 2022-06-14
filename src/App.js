//CSS
import "./App.css";
//REACT
import { useCallback, useEffect, useState } from "react";
//Data
import { wordList } from "./data/words";

//Components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const guesseQty = 3;

  //estado inicial do jogo
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordList);

  //estado da palavra escolhida
  const [pickedWord, setPickedWord] = useState("");

  //estado da categoria
  const [pickedCategory, setPickedCategory] = useState("");

  // lista de letras
  const [letters, setLetters] = useState([]);
  //estado das letras adivinhadas
  const [guessedLetters, setGuessedLetters] = useState([]);
  //estado das letras erradas
  const [wrongLetters, setWrongLetters] = useState([]);
  //estados das chances
  const [guesses, setGuesses] = useState(guesseQty);
  //estado dos pontos
  const [score, setScore] = useState(0);

  //função para pegar a categoria
  const pickWordAndCategory = useCallback(() => {
    //escolhe uma categoria aleatoria
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //escolhe uma palavra aleatoria
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  //funçao para iniciar o jogo
  const startGame = useCallback(() => {
    //escolhe a palavra e a categoria
    const { word, category } = pickWordAndCategory();
    clearLetterStates();

    // criar um array de letras
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //resetar estado
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //processa as letras do input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    //checa se a letra ja foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }
    //push a letra acertada ou perde uma chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
        setGuesses(guesses - 1),
      ]);
    }
  };
  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
    setGuesses(3);
  };

  useEffect(() => {
    if (guesses <= 0) {
      //reseta o jogo
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //checa a consição

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];
    //condição de vitoria
    if (guessedLetters.length === uniqueLetters.length) {
      //adicionar pontos
      setScore((actualScore) => (actualScore += 100));
      //RESTARTA O JOGO
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  //restarta o jogo
  const retry = () => {
    setScore(0);
    setGuesses(guesseQty);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
