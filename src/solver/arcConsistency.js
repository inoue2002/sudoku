// Arc Consistency Algorithm for Sudoku (AC-3)

class SudokuSolver {
  constructor() {
    this.size = 9;
    this.blockSize = 3;
  }

  // Initialize domains for each cell
  initializeDomains(board) {
    const domains = {};
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (board[i][j] === 0) {
          domains[`${i},${j}`] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        } else {
          domains[`${i},${j}`] = new Set([board[i][j]]);
        }
      }
    }
    return domains;
  }

  // Get all neighbors of a cell
  getNeighbors(row, col) {
    const neighbors = new Set();
    
    // Same row
    for (let j = 0; j < this.size; j++) {
      if (j !== col) neighbors.add(`${row},${j}`);
    }
    
    // Same column
    for (let i = 0; i < this.size; i++) {
      if (i !== row) neighbors.add(`${i},${col}`);
    }
    
    // Same 3x3 block
    const blockRow = Math.floor(row / this.blockSize) * this.blockSize;
    const blockCol = Math.floor(col / this.blockSize) * this.blockSize;
    for (let i = blockRow; i < blockRow + this.blockSize; i++) {
      for (let j = blockCol; j < blockCol + this.blockSize; j++) {
        if (i !== row || j !== col) {
          neighbors.add(`${i},${j}`);
        }
      }
    }
    
    return neighbors;
  }

  // Generate all arcs (constraints)
  generateArcs() {
    const arcs = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const neighbors = this.getNeighbors(i, j);
        for (const neighbor of neighbors) {
          arcs.push([`${i},${j}`, neighbor]);
        }
      }
    }
    return arcs;
  }

  // Revise arc consistency between two cells
  revise(domains, xi, xj) {
    let revised = false;
    const toRemove = [];
    
    for (const x of domains[xi]) {
      let hasSupport = false;
      for (const y of domains[xj]) {
        if (x !== y) {
          hasSupport = true;
          break;
        }
      }
      if (!hasSupport) {
        toRemove.push(x);
        revised = true;
      }
    }
    
    for (const x of toRemove) {
      domains[xi].delete(x);
    }
    
    return revised;
  }

  // AC-3 algorithm
  ac3(domains) {
    const queue = [...this.generateArcs()];
    
    while (queue.length > 0) {
      const [xi, xj] = queue.shift();
      
      if (this.revise(domains, xi, xj)) {
        if (domains[xi].size === 0) {
          return false; // No solution
        }
        
        const [row, col] = xi.split(',').map(Number);
        const neighbors = this.getNeighbors(row, col);
        
        for (const xk of neighbors) {
          if (xk !== xj) {
            queue.push([xk, xi]);
          }
        }
      }
    }
    
    return true;
  }

  // Check if solution is complete
  isComplete(domains) {
    for (const key in domains) {
      if (domains[key].size !== 1) {
        return false;
      }
    }
    return true;
  }

  // Select unassigned variable with minimum remaining values (MRV)
  selectUnassignedVariable(domains) {
    let minDomain = null;
    let minSize = Infinity;
    
    for (const key in domains) {
      if (domains[key].size > 1 && domains[key].size < minSize) {
        minSize = domains[key].size;
        minDomain = key;
      }
    }
    
    return minDomain;
  }

  // Backtracking search with AC-3
  backtrackingSearch(domains) {
    if (this.isComplete(domains)) {
      return domains;
    }
    
    const variable = this.selectUnassignedVariable(domains);
    if (!variable) return null;
    
    const values = [...domains[variable]];
    
    for (const value of values) {
      // Create a deep copy of domains
      const newDomains = {};
      for (const key in domains) {
        newDomains[key] = new Set(domains[key]);
      }
      
      // Assign value
      newDomains[variable] = new Set([value]);
      
      // Apply AC-3
      if (this.ac3(newDomains)) {
        const result = this.backtrackingSearch(newDomains);
        if (result !== null) {
          return result;
        }
      }
    }
    
    return null;
  }

  // Main solve function
  solve(board) {
    const domains = this.initializeDomains(board);
    
    // Apply initial AC-3
    if (!this.ac3(domains)) {
      return null;
    }
    
    // If not solved by AC-3 alone, use backtracking with AC-3
    const solution = this.backtrackingSearch(domains);
    
    if (solution) {
      // Convert domains to board
      const solvedBoard = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
      for (const key in solution) {
        const [row, col] = key.split(',').map(Number);
        solvedBoard[row][col] = [...solution[key]][0];
      }
      return solvedBoard;
    }
    
    return null;
  }
}

export default SudokuSolver;