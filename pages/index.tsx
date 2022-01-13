import { useEffect, useState } from 'react';
import { useClipboard } from 'use-clipboard-copy';

import { CompletedRow, CurrentRow, EmptyRow } from '../components/Row';
import { getRandomWord, isInWordList } from '../lib/words';

const KEYBOARD = {
  FIRST_ROW: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  SECOND_ROW: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  THIRD_ROW: ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL'],
};

const ROWS = [0, 1, 2, 3, 4, 5];

const GUESS_LENGTH = 5;
const MAX_GUESSES = 6;

enum GameState {
  PLAYING,
  WON,
  LOST,
}

const Home = () => {
  const [answer, setAnswer] = useState(getRandomWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [error, setError] = useState('');
  const [gameState, setGameState] = useState(GameState.PLAYING);
  const clipboard = useClipboard();

  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 5000);
  }, [error]);

  useEffect(() => {
    if (guesses.length === MAX_GUESSES) {
      setGameState(GameState.LOST);
    }
  }, [guesses]);

  const submitCurrentGuess = () => {
    if (currentGuess.length !== GUESS_LENGTH) {
      setError('Guess too short!');
      return;
    }

    if (!isInWordList(currentGuess)) {
      setError('Guess not in word list!');
      return;
    }

    if (currentGuess === answer) {
      setGameState(GameState.WON);
    }

    const guessesCopy = [...guesses];
    guessesCopy.push(currentGuess);

    setGuesses(guessesCopy);
    setCurrentGuess('');
  };

  const updateCurrentGuess = (letter: string) => {
    if (letter === 'ENTER') {
      submitCurrentGuess();
      return;
    }

    if (letter === 'DEL') {
      const updatedGuess = currentGuess.slice(0, -1);
      setCurrentGuess(updatedGuess);
      return;
    }

    if (currentGuess.length === GUESS_LENGTH) {
      return;
    }

    const updatedGuess = currentGuess + letter;
    setCurrentGuess(updatedGuess);
  };

  const onPlayAgain = () => {
    setCurrentGuess('');
    setGuesses([]);
    setGameState(GameState.PLAYING);
    setAnswer(getRandomWord());
  };

  const onCopyToClipboard = () => {
    let message = `${guesses.length}/${MAX_GUESSES}\n`;
    guesses.forEach((guess) => {
      guess.split('').forEach((letter, index) => {
        message +=
          letter === answer[index]
            ? '🟢'
            : answer.includes(letter)
            ? '🟡'
            : '⚪️';
      });

      message += '\n';
    });

    message += `Try it on: https://wordle.up.railway.app/`;
    clipboard.copy(message);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center py-16 space-y-10">
      <div className="flex flex-col space-y-1 items-center">
        <h1 className="text-5xl font-semibold text-purple-700">Wordle clone</h1>
        <small>
          <a
            href="https://www.powerlanguage.co.uk/wordle/"
            rel="noreferrer noopener"
            target="_blank"
            className="underline"
          >
            Play the original
          </a>
        </small>
      </div>

      {gameState === GameState.WON && (
        <div className="flex flex-col items-center space-y-2">
          <p className="text-green-500 font-semibold text-2xl">
            Congratulations, you guessed the right answer in {guesses.length}{' '}
            turn{guesses.length > 1 && 's'}!
          </p>
          <div className="flex flex-row space-x-5">
            <button
              onClick={onCopyToClipboard}
              className="bg-blue-500 text-white rounded-lg px-5 py-2 shadow max-w-max"
            >
              Copy to clipboard
            </button>
            <button
              onClick={onPlayAgain}
              className="text-white bg-purple-700 rounded-lg px-5 py-2 shadow max-w-max"
            >
              Play again?
            </button>
          </div>
        </div>
      )}
      {gameState === GameState.LOST && (
        <div className="flex flex-col items-center space-y-2">
          <p className="text-red-500 font-semibold text-2xl">
            Sorry, you couldn't guess the right answer. The answer was {answer}!
          </p>
          <button
            onClick={onPlayAgain}
            className="text-white bg-purple-700 rounded-lg px-5 py-2 shadow max-w-max"
          >
            Play again?
          </button>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col space-y-1">
        {ROWS.map((row) => (
          <>
            {row < guesses.length && (
              <CompletedRow guess={guesses[row]} answer={answer} />
            )}
            {row === guesses.length && (
              <CurrentRow currentGuess={currentGuess} />
            )}
            {row > guesses.length && <EmptyRow />}
          </>
        ))}
      </div>

      <div className="flex flex-col space-y-1">
        {Object.keys(KEYBOARD).map((key) => (
          <div className="flex space-x-1 justify-center">
            {KEYBOARD[key].map((letter) => (
              <button
                className="h-10 w-10 rounded border border-gray-300 bg-gray-50 flex items-center justify-center"
                onClick={() => updateCurrentGuess(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
