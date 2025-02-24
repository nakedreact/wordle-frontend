export default function Line({ guess, isFinal, solution }) {
  const tiles = [];
  const amount = 5;

  for (let i = 0; i < amount; i++) {
    const char = guess[i];
    let className = "tile";

    if (isFinal) {
      if (char === solution[i]) {
        className += " correct";
      } else if (solution.includes(char)) {
        className += " misplaced";
      } else className += " incorrect";
    }
    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }
  return <div className="line">{tiles}</div>;
}
