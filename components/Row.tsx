const CELLS = [0, 1, 2, 3, 4];

export const CurrentRow = ({ currentGuess }: { currentGuess: string }) => {
  return (
    <div className="flex space-x-1">
      {CELLS.map((cell) => (
        <div className="h-10 w-10 rounded border border-gray-300 bg-gray-50 flex items-center justify-center">
          {currentGuess[cell]}
        </div>
      ))}
    </div>
  );
};

export const EmptyRow = () => {
  return (
    <div className="flex space-x-1">
      {CELLS.map(() => (
        <div className="h-10 w-10 rounded border border-gray-300 bg-gray-50" />
      ))}
    </div>
  );
};

export const CompletedRow = ({
  guess,
  answer,
}: {
  guess: string;
  answer: string;
}) => {
  return (
    <div className="flex space-x-1">
      {CELLS.map((cell) => {
        let bgColor = 'bg-gray-500';
        if (answer.includes(guess[cell])) {
          bgColor = 'bg-yellow-500';
        }
        if (answer[cell] === guess[cell]) {
          bgColor = 'bg-green-500';
        }
        return (
          <div
            className={`h-10 w-10 rounded border border-gray-300 flex items-center justify-center ${bgColor}`}
          >
            {guess[cell]}
          </div>
        );
      })}
    </div>
  );
};
