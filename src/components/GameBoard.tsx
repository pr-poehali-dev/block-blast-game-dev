import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface Block {
  id: number;
  color: string;
  isActive: boolean;
  isClearing?: boolean;
}

interface GameBoardProps {
  onScoreChange: (score: number) => void;
  onComboChange: (combo: number) => void;
}

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981'];

export default function GameBoard({ onScoreChange, onComboChange }: GameBoardProps) {
  const [grid, setGrid] = useState<Block[][]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [selectedBlock, setSelectedBlock] = useState<{ row: number; col: number } | null>(null);

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid: Block[][] = [];
    let id = 0;
    for (let row = 0; row < 8; row++) {
      newGrid[row] = [];
      for (let col = 0; col < 8; col++) {
        newGrid[row][col] = {
          id: id++,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          isActive: true,
        };
      }
    }
    setGrid(newGrid);
  };

  const handleBlockClick = (row: number, col: number) => {
    if (!grid[row][col].isActive) return;

    if (!selectedBlock) {
      setSelectedBlock({ row, col });
    } else {
      const isAdjacent =
        (Math.abs(selectedBlock.row - row) === 1 && selectedBlock.col === col) ||
        (Math.abs(selectedBlock.col - col) === 1 && selectedBlock.row === row);

      if (isAdjacent) {
        swapBlocks(selectedBlock.row, selectedBlock.col, row, col);
        setSelectedBlock(null);
      } else {
        setSelectedBlock({ row, col });
      }
    }
  };

  const swapBlocks = (row1: number, col1: number, row2: number, col2: number) => {
    const newGrid = [...grid];
    const temp = newGrid[row1][col1];
    newGrid[row1][col1] = newGrid[row2][col2];
    newGrid[row2][col2] = temp;
    setGrid(newGrid);

    setTimeout(() => {
      checkMatches();
    }, 300);
  };

  const checkMatches = () => {
    const newGrid = [...grid];
    let matchFound = false;
    const toRemove: { row: number; col: number }[] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 6; col++) {
        const color = newGrid[row][col].color;
        if (
          newGrid[row][col].isActive &&
          newGrid[row][col + 1].color === color &&
          newGrid[row][col + 2].color === color
        ) {
          toRemove.push({ row, col }, { row, col: col + 1 }, { row, col: col + 2 });
          matchFound = true;
        }
      }
    }

    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 6; row++) {
        const color = newGrid[row][col].color;
        if (
          newGrid[row][col].isActive &&
          newGrid[row + 1][col].color === color &&
          newGrid[row + 2][col].color === color
        ) {
          toRemove.push({ row, col }, { row: row + 1, col }, { row: row + 2, col });
          matchFound = true;
        }
      }
    }

    if (matchFound) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      onComboChange(newCombo);

      toRemove.forEach(({ row, col }) => {
        newGrid[row][col].isClearing = true;
      });
      setGrid([...newGrid]);

      setTimeout(() => {
        toRemove.forEach(({ row, col }) => {
          newGrid[row][col].isActive = false;
        });

        const points = toRemove.length * 10 * newCombo;
        const newScore = score + points;
        setScore(newScore);
        onScoreChange(newScore);

        fillEmptySpaces(newGrid);
      }, 300);
    } else {
      setCombo(0);
      onComboChange(0);
    }
  };

  const fillEmptySpaces = (currentGrid: Block[][]) => {
    const newGrid = [...currentGrid];

    for (let col = 0; col < 8; col++) {
      let emptySpaces = 0;
      for (let row = 7; row >= 0; row--) {
        if (!newGrid[row][col].isActive) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          newGrid[row + emptySpaces][col] = { ...newGrid[row][col] };
          newGrid[row][col].isActive = false;
        }
      }

      for (let i = 0; i < emptySpaces; i++) {
        newGrid[i][col] = {
          id: Date.now() + Math.random(),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          isActive: true,
        };
      }
    }

    setGrid(newGrid);
    setTimeout(() => checkMatches(), 400);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-8 gap-2 p-4 bg-card/50 rounded-2xl backdrop-blur-sm border-2 border-primary/20">
        {grid.map((row, rowIndex) =>
          row.map((block, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleBlockClick(rowIndex, colIndex)}
              disabled={!block.isActive}
              className={`
                w-12 h-12 sm:w-14 sm:h-14 rounded-xl transition-all duration-200
                ${block.isActive ? 'cursor-pointer hover:scale-110' : 'opacity-0'}
                ${selectedBlock?.row === rowIndex && selectedBlock?.col === colIndex ? 'ring-4 ring-white scale-110' : ''}
                ${block.isClearing ? 'animate-block-clear' : 'animate-block-drop'}
              `}
              style={{
                backgroundColor: block.isActive ? block.color : 'transparent',
                boxShadow: block.isActive
                  ? `0 8px 20px ${block.color}50, inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,255,255,0.2)`
                  : 'none',
                transform: block.isActive ? 'perspective(100px) rotateX(5deg)' : 'none',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
