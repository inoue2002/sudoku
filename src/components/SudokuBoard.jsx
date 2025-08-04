import { useState } from 'react';
import SudokuSolver from '../solver/arcConsistency';
import './SudokuBoard.css';

function SudokuBoard() {
  const [board, setBoard] = useState(
    Array(9).fill(null).map(() => Array(9).fill(0))
  );
  const [initialBoard, setInitialBoard] = useState(
    Array(9).fill(null).map(() => Array(9).fill(0))
  );
  const [solving, setSolving] = useState(false);
  const [message, setMessage] = useState('');

  const handleCellChange = (row, col, value) => {
    const newValue = value === '' ? 0 : parseInt(value);
    if (isNaN(newValue) || newValue < 0 || newValue > 9) return;
    
    const newBoard = board.map((r, i) => 
      r.map((c, j) => (i === row && j === col) ? newValue : c)
    );
    setBoard(newBoard);
    setInitialBoard(newBoard);
  };

  const solveSudoku = async () => {
    setSolving(true);
    setMessage('Solving...');
    
    try {
      const solver = new SudokuSolver();
      const solution = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(solver.solve(board));
        }, 100);
      });
      
      if (solution) {
        setBoard(solution);
        setMessage('Solved successfully!');
      } else {
        setMessage('No solution exists for this puzzle.');
      }
    } catch (error) {
      setMessage('Error occurred while solving.');
    } finally {
      setSolving(false);
    }
  };

  const clearBoard = () => {
    setBoard(Array(9).fill(null).map(() => Array(9).fill(0)));
    setInitialBoard(Array(9).fill(null).map(() => Array(9).fill(0)));
    setMessage('');
  };

  const resetBoard = () => {
    setBoard(initialBoard.map(row => [...row]));
    setMessage('');
  };

  const loadExample = () => {
    const examplePuzzle = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];
    setBoard(examplePuzzle);
    setInitialBoard(examplePuzzle);
    setMessage('Example puzzle loaded');
  };

  const getCellClass = (row, col) => {
    let classes = 'sudoku-cell';
    if (initialBoard[row][col] !== 0) {
      classes += ' initial';
    }
    if (col % 3 === 2 && col !== 8) {
      classes += ' border-right';
    }
    if (row % 3 === 2 && row !== 8) {
      classes += ' border-bottom';
    }
    return classes;
  };

  return (
    <div className="sudoku-container">
      <h1>Sudoku Solver</h1>
      <p className="subtitle">Using Arc Consistency Algorithm (AC-3)</p>
      
      <div className="sudoku-grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                className={getCellClass(rowIndex, colIndex)}
                value={cell === 0 ? '' : cell}
                onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                disabled={solving}
                maxLength="1"
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="controls">
        <button onClick={solveSudoku} disabled={solving}>
          {solving ? 'Solving...' : 'Solve'}
        </button>
        <button onClick={resetBoard} disabled={solving}>
          Reset
        </button>
        <button onClick={clearBoard} disabled={solving}>
          Clear
        </button>
        <button onClick={loadExample} disabled={solving}>
          Load Example
        </button>
      </div>
      
      {message && (
        <div className={`message ${message.includes('Error') || message.includes('No solution') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default SudokuBoard;