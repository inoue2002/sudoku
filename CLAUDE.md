# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality checks
npm run lint
```

## Architecture Overview

This is a React-based Sudoku solver application that implements the AC-3 (Arc Consistency) algorithm combined with backtracking search for solving Sudoku puzzles.

### Core Algorithm Implementation

The solving logic is in `/src/solver/arcConsistency.js` and implements:
- **AC-3 Algorithm**: Constraint propagation using arc consistency to reduce the search space
- **Backtracking Search**: When AC-3 alone cannot solve the puzzle, uses backtracking with MRV (Minimum Remaining Values) heuristic
- **Domain Reduction**: Efficiently eliminates impossible values from cell domains based on Sudoku constraints

### Component Structure

- **Main Component**: `/src/components/SudokuBoard.jsx` - Handles all UI interactions and state management
- **State Management**: Uses React hooks (useState) for managing board state and solving status
- **Styling**: Component-specific CSS in `/src/components/SudokuBoard.css` with responsive design

### Key Implementation Details

1. **Board Representation**: 9x9 array where empty cells are represented as empty strings
2. **Visual Distinction**: Solved cells are displayed in green (#28a745) while initial cells remain black
3. **User Interaction**: Input validation ensures only digits 1-9 are accepted
4. **Error Handling**: Displays appropriate messages when puzzles are unsolvable

## Important Notes

- **No TypeScript**: This project uses pure JavaScript (ES6+)
- **No Test Suite**: Currently no testing framework is configured
- **Linting**: ESLint is configured - always run `npm run lint` before committing changes
- **Build Tool**: Uses Vite for fast development and optimized production builds