import { useState } from 'react';
import GameBoard from '@/components/GameBoard';
import GameStats from '@/components/GameStats';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GameProps {
  onNavigate: (page: string) => void;
}

export default function Game({ onNavigate }: GameProps) {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('blockBlastHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('blockBlastHighScore', newScore.toString());
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCombo(0);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('home')}
            className="hover:bg-primary/20"
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Block Blast
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRestart}
            className="hover:bg-primary/20"
          >
            <Icon name="RotateCcw" size={24} />
          </Button>
        </div>

        <GameStats score={score} combo={combo} highScore={highScore} />
        <GameBoard onScoreChange={handleScoreChange} onComboChange={setCombo} />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Соединяй блоки в ряды и колонны по 3+</p>
          <p className="mt-1">Делай комбо для множителя очков! 🔥</p>
        </div>
      </div>
    </div>
  );
}
